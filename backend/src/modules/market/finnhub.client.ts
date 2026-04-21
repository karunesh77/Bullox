import axios from 'axios';
import { ENV } from '../../config/env';
import { Quote, Candle, SymbolSearchResult, CandleInterval } from '../../types/market';

const finnhub = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: { token: ENV.FINNHUB_API_KEY },
  timeout: 8000,
});

// ── Get Quote ─────────────────────────────────────────────
export const getFinnhubQuote = async (symbol: string): Promise<Quote> => {
  const { data } = await finnhub.get('/quote', { params: { symbol } });

  if (!data || data.c === 0) throw new Error(`Quote not found for ${symbol}`);

  return {
    symbol,
    price: data.c,
    change: data.d,
    changePercent: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    prevClose: data.pc,
    timestamp: data.t,
  };
};

// ── Get Candles (OHLCV) ───────────────────────────────────
export const getFinnhubCandles = async (
  symbol: string,
  interval: CandleInterval,
  from: number,
  to: number
): Promise<Candle[]> => {
  const { data } = await finnhub.get('/stock/candle', {
    params: { symbol, resolution: interval, from, to },
  });

  if (data.s === 'no_data') return [];

  return data.t.map((timestamp: number, i: number) => ({
    timestamp,
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
    volume: data.v[i],
  }));
};

// ── Search Symbols ────────────────────────────────────────
export const searchFinnhubSymbols = async (query: string): Promise<SymbolSearchResult[]> => {
  const { data } = await finnhub.get('/search', { params: { q: query } });

  return (data.result || []).slice(0, 20).map((item: any) => ({
    symbol: item.symbol,
    name: item.description,
    type: item.type,
    exchange: item.primaryExchange || '',
  }));
};

// ── Top Gainers / Losers (US Market) ─────────────────────
export const getMarketMovers = async () => {
  // Finnhub free tier: use a fixed list of popular symbols
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];
  const quotes = await Promise.allSettled(symbols.map(getFinnhubQuote));

  return quotes
    .filter((r) => r.status === 'fulfilled')
    .map((r: any) => r.value)
    .sort((a, b) => b.changePercent - a.changePercent);
};
