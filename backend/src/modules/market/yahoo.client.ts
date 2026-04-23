import axios from 'axios';
import { Candle, CandleInterval } from '../../types/market';

const yahoo = axios.create({
  baseURL: 'https://query1.finance.yahoo.com/v7/finance',
  timeout: 10000,
});

// ── Map interval to Yahoo Finance format ────────────────────
const mapInterval = (interval: CandleInterval): string => {
  const intervalMap: Record<CandleInterval, string> = {
    '1': '1m',
    '5': '5m',
    '15': '15m',
    '30': '30m',
    '60': '1h',
    'D': '1d',
    'W': '1wk',
    'M': '1mo',
  };
  return intervalMap[interval] || '1d';
};

// ── Get Stock Candles from Yahoo Finance ────────────────────
export const getYahooCandles = async (
  symbol: string,
  interval: CandleInterval,
  from: number,
  to: number
): Promise<Candle[]> => {
  try {
    const yahooInterval = mapInterval(interval);

    // Yahoo Finance chart endpoint (from/to are in seconds)
    const { data } = await yahoo.get('/chart/' + symbol, {
      params: {
        interval: yahooInterval,
        period1: from,  // Already in seconds
        period2: to,    // Already in seconds
      },
    });

    if (!data.chart.result || !data.chart.result[0]) {
      return [];
    }

    const chart = data.chart.result[0];
    const timestamps = chart.timestamp || [];
    const quotes = chart.indicators?.quote?.[0] || {};

    return timestamps.map((timestamp: number, i: number) => ({
      timestamp: timestamp, // Yahoo returns timestamps in seconds, keep as-is
      open: quotes.open?.[i] || 0,
      high: quotes.high?.[i] || 0,
      low: quotes.low?.[i] || 0,
      close: quotes.close?.[i] || 0,
      volume: quotes.volume?.[i] || 0,
    })).filter((candle: Candle) => candle.close > 0); // Filter out empty candles
  } catch (error) {
    console.error(`Error fetching Yahoo candles for ${symbol}:`, error);
    return [];
  }
};
