import prisma from '../../config/prisma';
import { CreateWatchlistInput } from './watchlist.validation';

const FREE_WATCHLIST_LIMIT = 3;
const FREE_SYMBOLS_PER_WATCHLIST = 20;

// ── Create Watchlist ──────────────────────────────────────
export const createWatchlist = async (userId: string, input: CreateWatchlistInput) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const isPro = user?.role === 'PRO' || user?.role === 'ADMIN';

  if (!isPro) {
    const count = await prisma.watchlist.count({ where: { userId } });
    if (count >= FREE_WATCHLIST_LIMIT) {
      throw new Error(`Free tier allows max ${FREE_WATCHLIST_LIMIT} watchlists. Upgrade to Pro for unlimited.`);
    }
  }

  // Prevent duplicate name per user
  const existing = await prisma.watchlist.findFirst({
    where: { userId, name: input.name },
  });
  if (existing) throw new Error('A watchlist with this name already exists');

  return prisma.watchlist.create({
    data: { userId, name: input.name, symbols: [] },
  });
};

// ── Get All Watchlists ────────────────────────────────────
export const getUserWatchlists = async (userId: string) => {
  return prisma.watchlist.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
};

// ── Get Single Watchlist ──────────────────────────────────
export const getWatchlistById = async (watchlistId: string, userId: string) => {
  const watchlist = await prisma.watchlist.findFirst({
    where: { id: watchlistId, userId },
  });
  if (!watchlist) throw new Error('Watchlist not found');
  return watchlist;
};

// ── Add Symbol ────────────────────────────────────────────
export const addSymbolToWatchlist = async (watchlistId: string, userId: string, symbol: string) => {
  const watchlist = await prisma.watchlist.findFirst({
    where: { id: watchlistId, userId },
  });
  if (!watchlist) throw new Error('Watchlist not found');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const isPro = user?.role === 'PRO' || user?.role === 'ADMIN';

  if (!isPro && watchlist.symbols.length >= FREE_SYMBOLS_PER_WATCHLIST) {
    throw new Error(`Free tier allows max ${FREE_SYMBOLS_PER_WATCHLIST} symbols per watchlist.`);
  }

  if (watchlist.symbols.includes(symbol)) {
    throw new Error(`${symbol} is already in this watchlist`);
  }

  return prisma.watchlist.update({
    where: { id: watchlistId },
    data: { symbols: { push: symbol } },
  });
};

// ── Remove Symbol ─────────────────────────────────────────
export const removeSymbolFromWatchlist = async (watchlistId: string, userId: string, symbol: string) => {
  const watchlist = await prisma.watchlist.findFirst({
    where: { id: watchlistId, userId },
  });
  if (!watchlist) throw new Error('Watchlist not found');

  if (!watchlist.symbols.includes(symbol)) {
    throw new Error(`${symbol} not found in this watchlist`);
  }

  return prisma.watchlist.update({
    where: { id: watchlistId },
    data: { symbols: watchlist.symbols.filter((s) => s !== symbol) },
  });
};

// ── Rename Watchlist ──────────────────────────────────────
export const renameWatchlist = async (watchlistId: string, userId: string, name: string) => {
  const watchlist = await prisma.watchlist.findFirst({
    where: { id: watchlistId, userId },
  });
  if (!watchlist) throw new Error('Watchlist not found');

  const duplicate = await prisma.watchlist.findFirst({
    where: { userId, name, id: { not: watchlistId } },
  });
  if (duplicate) throw new Error('A watchlist with this name already exists');

  return prisma.watchlist.update({
    where: { id: watchlistId },
    data: { name },
  });
};

// ── Delete Watchlist ──────────────────────────────────────
export const deleteWatchlist = async (watchlistId: string, userId: string) => {
  const watchlist = await prisma.watchlist.findFirst({
    where: { id: watchlistId, userId },
  });
  if (!watchlist) throw new Error('Watchlist not found');

  return prisma.watchlist.delete({ where: { id: watchlistId } });
};
