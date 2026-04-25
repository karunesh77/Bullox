export interface Signal {
  id: string;
  symbol: string;
  asset: string;
  signal: 'BUY' | 'SELL';
  entry: number;
  target: number;
  stopLoss: number;
  confidence: number; // 0-100
  timeframe: '1H' | '4H' | '1D' | '1W';
  reason: string;
  riskReward: number;
  createdAt: Date;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  profitTaken?: number;
  lossBooked?: number;
}

export interface SignalFilter {
  type?: 'BUY' | 'SELL' | 'ALL';
  minConfidence?: number;
  timeframe?: string[];
}

export interface SignalStats {
  totalSignals: number;
  winRate: number;
  avgRiskReward: number;
  profitFactor: number;
}
