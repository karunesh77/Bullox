export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume?: number;
  isCrypto?: boolean;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface SearchResult {
  symbol: string;
  description: string;
  type: string;
}

export type CandleInterval = '1' | '5' | '15' | '30' | '60' | 'D' | 'W';
