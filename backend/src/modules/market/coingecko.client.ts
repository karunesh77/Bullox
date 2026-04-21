import axios from 'axios';
import { Quote, Candle } from '../../types/market';

const coingecko = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 8000,
});

// CoinGecko symbol → id map (most popular)
const CRYPTO_ID_MAP: Record<string, string> = {
  BTCUSDT: 'bitcoin',
  ETHUSDT: 'ethereum',
  BNBUSDT: 'binancecoin',
  SOLUSDT: 'solana',
  XRPUSDT: 'ripple',
  ADAUSDT: 'cardano',
  DOGEUSDT: 'dogecoin',
  MATICUSDT: 'matic-network',
  DOTUSDT: 'polkadot',
  LTCUSDT: 'litecoin',
};

// ── Get Crypto Quote ──────────────────────────────────────
export const getCryptoQuote = async (symbol: string): Promise<Quote> => {
  const coinId = CRYPTO_ID_MAP[symbol.toUpperCase()];
  if (!coinId) throw new Error(`Crypto symbol not supported: ${symbol}`);

  const { data } = await coingecko.get('/simple/price', {
    params: {
      ids: coinId,
      vs_currencies: 'usd',
      include_24hr_change: true,
      include_24hr_vol: true,
      include_last_updated_at: true,
    },
  });

  const coin = data[coinId];
  if (!coin) throw new Error(`Data not found for ${symbol}`);

  return {
    symbol,
    price: coin.usd,
    change: 0,
    changePercent: coin.usd_24h_change || 0,
    high: 0,
    low: 0,
    open: 0,
    prevClose: 0,
    timestamp: coin.last_updated_at || Date.now() / 1000,
  };
};

// ── Get Top Crypto List ───────────────────────────────────
export const getTopCrypto = async (limit = 20) => {
  const { data } = await coingecko.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: limit,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h',
    },
  });

  return data.map((coin: any) => ({
    symbol: coin.symbol.toUpperCase() + 'USDT',
    name: coin.name,
    price: coin.current_price,
    change: coin.price_change_24h,
    changePercent: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    volume: coin.total_volume,
    image: coin.image,
  }));
};

// ── Get Crypto Candles ────────────────────────────────────
export const getCryptoCandles = async (symbol: string, days = 7): Promise<Candle[]> => {
  const coinId = CRYPTO_ID_MAP[symbol.toUpperCase()];
  if (!coinId) throw new Error(`Crypto symbol not supported: ${symbol}`);

  const { data } = await coingecko.get(`/coins/${coinId}/ohlc`, {
    params: { vs_currency: 'usd', days },
  });

  return data.map(([timestamp, open, high, low, close]: number[]) => ({
    timestamp: Math.floor(timestamp / 1000),
    open, high, low, close,
    volume: 0,
  }));
};
