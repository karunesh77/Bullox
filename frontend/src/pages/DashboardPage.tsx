import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  TrendingUp, TrendingDown, Newspaper, Activity, Flame, Crown, Eye, BarChart3
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';

// Real-time mock price generator
const generateMockPrice = (basePrice: number, volatility: number = 0.02): number => {
  const change = (Math.random() - 0.5) * volatility * basePrice;
  return Math.round((basePrice + change) * 100) / 100;
};

const basePortfolioData = [
  { date: '12 AM', value: 100000 },
  { date: '04 AM', value: 102400 },
  { date: '08 AM', value: 101200 },
  { date: '12 PM', value: 105800 },
  { date: '04 PM', value: 103600 },
  { date: '08 PM', value: 118400 },
];

const basePortfolioAssets = [
  { id: 'BTC', symbol: 'BTC', name: 'Bitcoin', qty: 0.35, buyPrice: 56200, basePrice: 67260.5, pnl: 3887.68, allocation: 19.68, change24h: 2.45 },
  { id: 'ETH', symbol: 'ETH', name: 'Ethereum', qty: 2.15, buyPrice: 2850, basePrice: 3420.25, pnl: 1226.54, allocation: 20.02, change24h: 1.32 },
  { id: 'SOL', symbol: 'SOL', name: 'Solana', qty: 10.25, buyPrice: 126.40, basePrice: 165.30, pnl: 398.73, allocation: 30.79, change24h: -1.23 },
  { id: 'BNB', symbol: 'BNB', name: 'BNB', qty: 1.20, buyPrice: 520, basePrice: 615.40, pnl: 114.48, allocation: 18.35, change24h: 0.85 },
];

const signals = [
  { symbol: 'BTCUSDT', asset: 'Bitcoin', signal: 'BUY', entry: 67250, target: 71500, stopLoss: 64200, confidence: 82, reason: 'Bullish breakout' },
  { symbol: 'ETHUSDT', asset: 'Ethereum', signal: 'SELL', entry: 3420, target: 3120, stopLoss: 3680, confidence: 76, reason: 'Resistance rejection' },
  { symbol: 'SOLUSDT', asset: 'Solana', signal: 'BUY', entry: 165.30, target: 178.60, stopLoss: 155.20, confidence: 71, reason: 'Support bounce' },
];

const recentNews = [
  { title: 'Bitcoin ETF sees $200M inflow as market sentiment turns positive', sentiment: 'BULLISH', source: 'CoinDesk', time: '2m ago' },
  { title: 'Ethereum upgrades show positive impact on network performance', sentiment: 'BULLISH', source: 'Crypto News', time: '1h ago' },
  { title: 'Solana ecosystem growth continues with new projects launching', sentiment: 'BULLISH', source: 'Blockworks', time: '1h ago' },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-dark-secondary mb-0.5">{payload[0].payload.date}</p>
      <p className="text-primary font-semibold">${payload[0].value.toLocaleString()}</p>
    </div>
  );
}

function StatCard({ label, value, change, positive, icon }: any) {
  return (
    <div className="card card-hover p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-dark-secondary text-sm font-semibold uppercase tracking-wider">{label}</p>
        <div className={cn('p-2 rounded-lg', positive ? 'bg-green-900/30' : 'bg-red-900/30')}>
          {icon}
        </div>
      </div>
      <p className="text-value text-white">{value}</p>
      {change && (
        <p className={cn('text-sm font-semibold flex items-center gap-1', positive ? 'text-success' : 'text-danger')}>
          {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {positive ? '+' : ''}{change}
        </p>
      )}
    </div>
  );
}

function SignalCard({ signal }: any) {
  const isLong = signal.signal === 'BUY';

  return (
    <div className="card card-hover p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-base font-bold text-dark-primary">{signal.symbol}</p>
            <span className={cn('badge text-[10px] font-bold px-2 py-1 rounded-lg',
              isLong ? 'badge-buy' : 'badge-sell'
            )}>
              {signal.signal}
            </span>
          </div>
          <p className="text-xs text-dark-secondary">{signal.reason}</p>
        </div>
        <p className="text-xs font-bold text-primary">{signal.confidence}%</p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-dark-tertiary rounded p-2">
          <p className="text-dark-secondary mb-1">Entry</p>
          <p className="font-bold text-dark-primary">${signal.entry.toLocaleString()}</p>
        </div>
        <div className="bg-green-900/20 rounded p-2">
          <p className="text-dark-secondary mb-1">Target</p>
          <p className="font-bold text-success">${signal.target.toLocaleString()}</p>
        </div>
        <div className="bg-red-900/20 rounded p-2">
          <p className="text-dark-secondary mb-1">Stop Loss</p>
          <p className="font-bold text-danger">${signal.stopLoss.toLocaleString()}</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-3 h-1.5 bg-dark-tertiary rounded-full overflow-hidden">
        <div
          className={cn('h-full', isLong ? 'bg-success' : 'bg-danger')}
          style={{ width: `${signal.confidence}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isPro = user?.role === 'PRO' || user?.role === 'EXPERT';

  const [topMoversPrices, setTopMoversPrices] = useState(basePortfolioAssets.map(a => ({ symbol: a.symbol, name: a.name, basePrice: a.basePrice, price: a.basePrice, change: a.change24h.toFixed(2), up: a.change24h >= 0 })));
  const [totalValue, setTotalValue] = useState(118400);

  // Real-time updates every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updated = basePortfolioAssets.map(asset => ({
        ...asset,
        currentPrice: generateMockPrice(asset.basePrice, 0.015),
      }));
      const newTotal = updated.reduce((sum, a) => sum + (a.currentPrice * a.qty), 0);
      setTotalValue(newTotal);

      const updatedMovers = basePortfolioAssets.map(a => ({
        symbol: a.symbol,
        name: a.name,
        basePrice: a.basePrice,
        price: generateMockPrice(a.basePrice, 0.02),
        change: a.change24h.toFixed(2),
        up: a.change24h >= 0,
      }));
      setTopMoversPrices(updatedMovers);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const invested = 100000;
  const pnl = totalValue - invested;
  const pnlPct = ((pnl / invested) * 100).toFixed(2);
  const isUp = pnl >= 0;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#1f1f2e' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-dark-primary">Good morning, John! 👋</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-900/30 text-success text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-dark-secondary">Track your portfolio & follow smart trading signals in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            {!isPro && (
              <Link
                to="/subscription"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all"
              >
                <Crown size={16} />
                Upgrade to Pro
              </Link>
            )}
            <button className="p-3 card hover:bg-dark-tertiary text-dark-secondary hover:text-dark-primary transition-all">
              <Eye size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Portfolio Value"
            value={`$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
            change={`${pnlPct}%`}
            positive={isUp}
            icon={<BarChart3 size={20} className={isUp ? 'text-success' : 'text-danger'} />}
          />
          <StatCard
            label="Today's P&L"
            value={`$${Math.abs(pnl).toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
            change={`${pnlPct}%`}
            positive={isUp}
            icon={<TrendingUp size={20} className={isUp ? 'text-success' : 'text-danger'} />}
          />
          <StatCard
            label="Total Profit"
            value="$5,430.20"
            change="28.12%"
            positive={true}
            icon={<Activity size={20} className="text-success" />}
          />
          <StatCard
            label="Win Rate"
            value="68.6%"
            change=""
            positive={true}
            icon={<div className="w-8 h-8 rounded-full border-2 border-success" />}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Chart - spans 2 columns */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-dark-secondary text-sm font-semibold mb-2">Portfolio Performance</p>
                <p className="text-4xl font-bold text-dark-primary">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-900/30">
                <Activity size={14} className="text-success animate-pulse" />
                <span className="text-xs text-success font-bold">LIVE</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={basePortfolioData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8871ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8871ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#8871ff" strokeWidth={2.5} fill="url(#colorValue)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trending Signals */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-dark-primary flex items-center gap-2">
                <Flame size={16} className="text-warning" />
                Trending Signals
              </h3>
              <Link to="/signals" className="text-primary text-xs font-bold hover:text-primary-light">View All</Link>
            </div>

            <div className="space-y-3">
              {signals.map((signal, i) => (
                <SignalCard key={i} signal={signal} />
              ))}
            </div>
          </div>
        </div>

        {/* Your Assets Table */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-dark-primary">Your Assets</h3>
            <Link to="/portfolio" className="text-primary text-xs font-bold hover:text-primary-light">Manage Portfolio</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-dark-secondary font-semibold">Asset</th>
                  <th className="text-right py-3 px-4 text-dark-secondary font-semibold">Qty</th>
                  <th className="text-right py-3 px-4 text-dark-secondary font-semibold">Avg. Price</th>
                  <th className="text-right py-3 px-4 text-dark-secondary font-semibold">Current Price</th>
                  <th className="text-right py-3 px-4 text-dark-secondary font-semibold">24h Change</th>
                  <th className="text-right py-3 px-4 text-dark-secondary font-semibold">P&L</th>
                  <th className="text-right py-3 px-4 text-dark-secondary font-semibold">P&L %</th>
                </tr>
              </thead>
              <tbody>
                {basePortfolioAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-dark-border hover:bg-dark-tertiary/50 transition-all">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-dark-primary">{asset.symbol}</p>
                          <p className="text-xs text-dark-secondary">{asset.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-dark-primary font-semibold">{asset.qty}</td>
                    <td className="text-right py-3 px-4 text-dark-primary font-semibold">${asset.buyPrice.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-dark-primary font-semibold">${asset.basePrice.toLocaleString()}</td>
                    <td className={cn('text-right py-3 px-4 font-semibold flex items-center justify-end gap-1', asset.change24h >= 0 ? 'text-success' : 'text-danger')}>
                      {asset.change24h >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(asset.change24h).toFixed(2)}%
                    </td>
                    <td className={cn('text-right py-3 px-4 font-semibold', asset.pnl >= 0 ? 'text-success' : 'text-danger')}>
                      ${asset.pnl.toLocaleString()}
                    </td>
                    <td className={cn('text-right py-3 px-4 font-semibold', asset.allocation >= 0 ? 'text-success' : 'text-danger')}>
                      +{asset.allocation.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Overview */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-dark-primary">Market Overview</h3>
              <Link to="/market" className="text-primary text-xs font-bold">View All</Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-tertiary rounded-lg">
                <span className="text-sm font-semibold text-dark-primary">Top Gainers</span>
                <span className="text-success font-bold text-xs">+18.75%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-tertiary rounded-lg">
                <span className="text-sm font-semibold text-dark-primary">Top Losers</span>
                <span className="text-danger font-bold text-xs">-14.32%</span>
              </div>
            </div>
          </div>

          {/* News Feed */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-dark-primary flex items-center gap-2">
                <Newspaper size={16} />
                News
              </h3>
              <Link to="/news" className="text-primary text-xs font-bold">View All</Link>
            </div>
            <div className="space-y-3">
              {recentNews.map((n, i) => (
                <Link key={i} to="/news" className="block p-2 rounded hover:bg-dark-tertiary/50 transition-all group">
                  <p className="text-xs text-dark-secondary line-clamp-2 group-hover:text-dark-primary">{n.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn('text-[10px] font-bold px-2 py-1 rounded',
                      n.sentiment === 'BULLISH' ? 'bg-green-900/30 text-success' : 'bg-red-900/30 text-danger'
                    )}>
                      {n.sentiment}
                    </span>
                    <span className="text-[10px] text-dark-secondary">{n.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Watchlist Quick View */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-dark-primary">Watchlist</h3>
              <Link to="/watchlist" className="text-primary text-xs font-bold">View All</Link>
            </div>
            <div className="space-y-2">
              {topMoversPrices.slice(0, 4).map((m, i) => (
                <Link key={i} to="/market" className="flex items-center justify-between p-2 rounded hover:bg-dark-tertiary/50 transition-all group">
                  <div>
                    <p className="text-sm font-semibold text-dark-primary group-hover:text-primary">{m.symbol}</p>
                    <p className="text-xs text-dark-secondary">{m.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-dark-primary">${m.price.toFixed(2)}</p>
                    <p className={cn('text-xs font-bold', m.up ? 'text-success' : 'text-danger')}>
                      {m.up ? '+' : ''}{parseFloat(m.change).toFixed(2)}%
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
