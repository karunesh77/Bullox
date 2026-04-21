import api from './axios';

export const marketApi = {
  getQuote: (symbol: string) => api.get(`/market/quote/${symbol}`),
  getBulkQuotes: (symbols: string[]) => api.get(`/market/quotes?symbols=${symbols.join(',')}`),
  getCandles: (symbol: string, interval = 'D') => api.get(`/market/candles/${symbol}?interval=${interval}`),
  searchSymbols: (q: string) => api.get(`/market/search?q=${q}`),
  getTopCrypto: () => api.get('/market/crypto'),
  getMovers: (type: 'gainers' | 'losers' = 'gainers') => api.get(`/market/movers?type=${type}`),
};
