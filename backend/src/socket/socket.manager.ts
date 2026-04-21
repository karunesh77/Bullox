import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { ENV } from '../config/env';
import { logger } from '../utils/logger';
import { verifyAccessToken } from '../modules/auth/auth.service';
import { getQuote } from '../modules/market/market.service';

// symbol → Set of socketIds subscribed to it
const subscriptions = new Map<string, Set<string>>();

// socketId → Set of symbols it subscribed to (for cleanup)
const socketSymbols = new Map<string, Set<string>>();

let io: SocketServer | null = null;
let priceInterval: NodeJS.Timeout | null = null;

// ── Subscribe helper ──────────────────────────────────────
const subscribe = (socketId: string, symbol: string) => {
  const upper = symbol.toUpperCase();
  if (!subscriptions.has(upper)) subscriptions.set(upper, new Set());
  subscriptions.get(upper)!.add(socketId);

  if (!socketSymbols.has(socketId)) socketSymbols.set(socketId, new Set());
  socketSymbols.get(socketId)!.add(upper);
};

// ── Unsubscribe helper ────────────────────────────────────
const unsubscribe = (socketId: string, symbol: string) => {
  const upper = symbol.toUpperCase();
  subscriptions.get(upper)?.delete(socketId);
  if (subscriptions.get(upper)?.size === 0) subscriptions.delete(upper);
  socketSymbols.get(socketId)?.delete(upper);
};

// ── Cleanup on disconnect ─────────────────────────────────
const cleanupSocket = (socketId: string) => {
  const symbols = socketSymbols.get(socketId);
  if (symbols) {
    for (const symbol of symbols) {
      subscriptions.get(symbol)?.delete(socketId);
      if (subscriptions.get(symbol)?.size === 0) subscriptions.delete(symbol);
    }
  }
  socketSymbols.delete(socketId);
};

// ── Broadcast prices for all subscribed symbols ───────────
const broadcastPrices = async () => {
  if (!io || subscriptions.size === 0) return;

  for (const [symbol, socketIds] of subscriptions.entries()) {
    if (socketIds.size === 0) continue;
    try {
      const quote = await getQuote(symbol);
      for (const socketId of socketIds) {
        io.to(socketId).emit('price:update', { symbol, quote, ts: Date.now() });
      }
    } catch {
      // Symbol fetch failed — silently skip
    }
  }
};

// ── Init Socket.IO ────────────────────────────────────────
export const initSocketIO = (httpServer: HttpServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: ENV.FRONTEND_URL,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Optional JWT auth on connection (non-blocking — guests can connect too)
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (token) {
      try {
        const payload = verifyAccessToken(token);
        (socket as any).userId = payload.userId;
      } catch {
        // Invalid token — connect as guest (read-only)
      }
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

    // Client subscribes to a symbol's price stream
    socket.on('subscribe', (symbol: string) => {
      if (typeof symbol !== 'string' || !symbol.trim()) return;
      subscribe(socket.id, symbol.trim());
      socket.emit('subscribed', { symbol: symbol.toUpperCase() });
      logger.info(`📡 ${socket.id} subscribed to ${symbol.toUpperCase()}`);
    });

    // Client subscribes to multiple symbols at once
    socket.on('subscribe:bulk', (symbols: string[]) => {
      if (!Array.isArray(symbols)) return;
      const valid = symbols.filter((s) => typeof s === 'string' && s.trim()).slice(0, 20);
      for (const symbol of valid) subscribe(socket.id, symbol.trim());
      socket.emit('subscribed:bulk', { symbols: valid.map((s) => s.toUpperCase()) });
    });

    // Client unsubscribes from a symbol
    socket.on('unsubscribe', (symbol: string) => {
      if (typeof symbol !== 'string') return;
      unsubscribe(socket.id, symbol.trim());
      socket.emit('unsubscribed', { symbol: symbol.toUpperCase() });
    });

    // Client requests immediate price (one-shot, no subscription)
    socket.on('price:get', async (symbol: string) => {
      if (typeof symbol !== 'string' || !symbol.trim()) return;
      try {
        const quote = await getQuote(symbol.trim().toUpperCase());
        socket.emit('price:update', { symbol: symbol.toUpperCase(), quote, ts: Date.now() });
      } catch {
        socket.emit('price:error', { symbol, message: 'Failed to fetch price' });
      }
    });

    socket.on('disconnect', () => {
      cleanupSocket(socket.id);
      logger.info(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  // Broadcast prices every 5 seconds
  priceInterval = setInterval(broadcastPrices, 5000);

  logger.info('✅ Socket.IO initialized — broadcasting every 5s');
  return io;
};

export const getIO = (): SocketServer | null => io;
