export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  allocation: number;
  change24h: number;
  change24hPercent: number;
  lastUpdated?: Date;
}

export interface Portfolio {
  id: string;
  totalValue: number;
  todayPnL: number;
  todayPnLPercent: number;
  weekPnL?: number;
  monthPnL?: number;
  assets: PortfolioAsset[];
  lastUpdated: Date;
}

export interface PortfolioResponse {
  success: boolean;
  data: Portfolio;
}
