import { getRedis } from '../../config/redis';
import { getFinnhubQuote, getFinnhubCandles, searchFinnhubSymbols, getMarketMovers } from './finnhub.client';
import { getCryptoQuote, getTopCrypto, getCryptoCandles } from './coingecko.client';
import { Quote, Candle, CandleInterval } from '../../types/market';

const CRYPTO_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'];

const isCrypto = (symbol: string) => CRYPTO_SYMBOLS.includes(symbol.toUpperCase());

// ── Redis Cache Helper ────────────────────────────────────
const getFromCache = async (key: string) => {
  const redis = getRedis();
  if (!redis) return null;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key: string, data: any, ttlSeconds: number) => {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
};

// ── Get Single Quote ──────────────────────────────────────
export const getQuote = async (symbol: string): Promise<Quote> => {
  const cacheKey = `quote:${symbol.toUpperCase()}`;

  // Check cache first
  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  // Fetch from provider
  const quote = isCrypto(symbol)
    ? await getCryptoQuote(symbol)
    : await getFinnhubQuote(symbol);

  // Cache for 5 seconds (live data)
  await setCache(cacheKey, quote, 5);

  return quote;
};

// ── Get Bulk Quotes ───────────────────────────────────────
export const getBulkQuotes = async (symbols: string[]): Promise<Quote[]> => {
  const results = await Promise.allSettled(symbols.map(getQuote));
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r: any) => r.value);
};

// ── Get Candles ───────────────────────────────────────────
export const getCandles = async (
  symbol: string,
  interval: CandleInterval,
  from: number,
  to: number
): Promise<Candle[]> => {
  const cacheKey = `candles:${symbol}:${interval}:${from}:${to}`;

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const candles = isCrypto(symbol)
    ? await getCryptoCandles(symbol)
    : await getFinnhubCandles(symbol, interval, from, to);

  // Cache candles for 60 seconds
  await setCache(cacheKey, candles, 60);

  return candles;
};

// ── Search Symbols ────────────────────────────────────────
export const searchSymbols = async (query: string) => {
  const cacheKey = `search:${query.toLowerCase()}`;

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const results = await searchFinnhubSymbols(query);

  // Cache search for 5 minutes
  await setCache(cacheKey, results, 300);

  return results;
};

// ── Top Crypto ────────────────────────────────────────────
export const getTopCryptoList = async () => {
  const cacheKey = 'crypto:top20';

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const data = await getTopCrypto(20);

  // Cache for 30 seconds
  await setCache(cacheKey, data, 30);

  return data;
};

// ── Market Movers ─────────────────────────────────────────
export const getMovers = async () => {
  const cacheKey = 'market:movers';

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const data = await getMarketMovers();

  // Cache for 60 seconds
  await setCache(cacheKey, data, 60);

  return data;
};
