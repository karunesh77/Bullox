import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  TrendingUp, TrendingDown, Activity, Flame, Plus,
  Newspaper, Eye
} from 'lucide-react';
import PortfolioChart from '@/components/charts/PortfolioChart';

/* ─── Constants ──────────────────────────────────────────── */
const BG        = '#0B0F19';
const CARD      = '#111827';
const ELEVATED  = '#1F2937';
const BORDER    = '#1F2937';
const TEXT1     = '#E5E7EB';
const TEXT2     = '#9CA3AF';
const TEXT3     = '#6B7280';
const GREEN     = '#22C55E';
const RED       = '#EF4444';
const BLUE      = '#3B82F6';
const YELLOW    = '#F59E0B';

/* ─── Coin Icons ─────────────────────────────────────────── */
const COIN_COLORS: Record<string, { bg: string; text: string }> = {
  BTC:  { bg: '#F7931A', text: '#fff' },
  ETH:  { bg: '#627EEA', text: '#fff' },
  SOL:  { bg: '#9945FF', text: '#fff' },
  BNB:  { bg: '#F3BA2F', text: '#000' },
};

/* ─── Mock data ──────────────────────────────────────────── */
const generateMockPrice = (base: number, vol = 0.02) =>
  Math.round((base + (Math.random() - 0.5) * vol * base) * 100) / 100;

const BASE_CHART = [
  { t: '12 AM', v: 100000 },
  { t: '04 AM', v: 102400 },
  { t: '08 AM', v: 101200 },
  { t: '12 PM', v: 105800 },
  { t: '04 PM', v: 103600 },
  { t: '08 PM', v: 118400 },
];

const ASSETS = [
  { id: 'BTC', symbol: 'BTC', name: 'Bitcoin',  qty: 0.35, buyPrice: 56200, basePrice: 67260.5, pnl: 3887.68, pnlPct: 19.68, change24h:  2.45 },
  { id: 'ETH', symbol: 'ETH', name: 'Ethereum', qty: 2.15, buyPrice: 2850,  basePrice: 3420.25,  pnl: 1226.54, pnlPct: 20.02, change24h:  1.32 },
  { id: 'SOL', symbol: 'SOL', name: 'Solana',   qty: 10.25,buyPrice: 126.4, basePrice: 165.30,   pnl: 398.73,  pnlPct: 30.79, change24h: -1.23 },
  { id: 'BNB', symbol: 'BNB', name: 'BNB',      qty: 1.20, buyPrice: 520,   basePrice: 615.40,   pnl: 114.48,  pnlPct: 18.35, change24h:  0.85 },
];

const SIGNALS = [
  { symbol: 'BTC/USDT', asset: 'Bitcoin',  signal: 'BUY',  entry: 67250, target: 71500, stopLoss: 64200, confidence: 82, reason: 'Bullish breakout' },
  { symbol: 'ETH/USDT', asset: 'Ethereum', signal: 'SELL', entry: 3420,  target: 3120,  stopLoss: 3680,  confidence: 76, reason: 'Resistance rejection' },
  { symbol: 'SOL/USDT', asset: 'Solana',   signal: 'BUY',  entry: 165.3, target: 178.6, stopLoss: 155.2, confidence: 71, reason: 'Support bounce' },
];

const NEWS = [
  { title: 'Bitcoin ETF sees $200M inflow as market sentiment turns positive', sentiment: 'BULLISH', source: 'CoinDesk', time: '2m ago', img: '🟡' },
  { title: 'Ethereum upgrades show positive impact on network performance',     sentiment: 'BULLISH', source: 'Crypto News', time: '15m ago', img: '🔵' },
  { title: 'Solana ecosystem growth continues with new projects launching',     sentiment: 'BULLISH', source: 'Blockworks', time: '1h ago',  img: '🟣' },
];

/* ─── Sub-components ─────────────────────────────────────── */

function StatCard({ label, value, change, positive, children }: any) {
  // Mini sparkline - simple up/down trend
  const sparkData = [100, 108, 104, 112, 110, 115];
  const maxVal = Math.max(...sparkData);
  const minVal = Math.min(...sparkData);
  const range = maxVal - minVal || 1;

  return (
    <div
      style={{ backgroundColor: CARD, borderColor: BORDER }}
      className="border rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-default"
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#1A2233';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = CARD;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p style={{ color: TEXT3 }} className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">{label}</p>
          <p style={{ color: TEXT1 }} className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 truncate">{value}</p>
          {change && (
            <p style={{ color: positive ? GREEN : RED }} className="text-xs sm:text-sm font-semibold flex items-center gap-0.5">
              {positive ? <TrendingUp size={12} className="sm:w-[14px] sm:h-[14px]" /> : <TrendingDown size={12} className="sm:w-[14px] sm:h-[14px]" />}
              {positive ? '+' : ''}{change}
            </p>
          )}
        </div>

        {/* Right side: Sparkline or Circle indicator */}
        {children ? (
          <div className="flex-shrink-0">
            {children}
          </div>
        ) : (
          <svg width="45" height="20" viewBox="0 0 50 24" style={{ marginLeft: '4px' }} className="sm:w-[50px] sm:h-[24px]">
            <polyline
              points={sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * 50},${24 - ((v - minVal) / range) * 20}`).join(' ')}
              fill="none"
              stroke={positive ? GREEN : RED}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

function SignalCard({ signal }: any) {
  const isBuy = signal.signal === 'BUY';
  const coin  = COIN_COLORS[signal.asset.slice(0, 3).toUpperCase()] || { bg: BLUE, text: '#fff' };

  return (
    <div
      style={{ backgroundColor: ELEVATED, borderColor: BORDER }}
      className="border rounded-2xl p-4 transition-all duration-200"
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#263347'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
    >
      {/* Row 1 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div style={{ backgroundColor: coin.bg, color: coin.text }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
            {signal.asset[0]}
          </div>
          <div>
            <p style={{ color: TEXT1 }} className="text-sm font-bold leading-none mb-1">{signal.symbol}</p>
            <p style={{ color: TEXT2 }} className="text-xs">{signal.reason}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={isBuy
              ? { backgroundColor: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }
              : { backgroundColor: 'rgba(239,68,68,0.15)',  color: RED,   border: '1px solid rgba(239,68,68,0.3)'  }
            }
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
          >
            {signal.signal}
          </span>
          <span style={{ color: BLUE }} className="text-sm font-bold">{signal.confidence}%</span>
        </div>
      </div>

      {/* Entry / Target / SL */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div style={{ backgroundColor: '#0B0F19' }} className="rounded-xl p-3">
          <p style={{ color: TEXT3 }} className="mb-1">Entry</p>
          <p style={{ color: TEXT1 }} className="font-bold">${signal.entry.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }} className="rounded-xl p-3">
          <p style={{ color: GREEN }} className="mb-1 font-semibold">Target</p>
          <p style={{ color: GREEN }} className="font-bold">${signal.target.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }} className="rounded-xl p-3">
          <p style={{ color: RED }} className="mb-1 font-semibold">Stop Loss</p>
          <p style={{ color: RED }} className="font-bold">${signal.stopLoss.toLocaleString()}</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div style={{ backgroundColor: '#0B0F19' }} className="h-1.5 rounded-full overflow-hidden">
        <div
          style={{ width: `${signal.confidence}%`, backgroundColor: isBuy ? GREEN : RED }}
          className="h-full rounded-full transition-all"
        />
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const isPro = user?.role === 'PRO' || user?.role === 'EXPERT';

  const [totalValue, setTotalValue] = useState(118400);
  const [assetPrices, setAssetPrices] = useState(
    ASSETS.map(a => ({ ...a, currentPrice: a.basePrice }))
  );

  /* Real-time updates every 3s */
  useEffect(() => {
    const id = setInterval(() => {
      const updated = ASSETS.map(a => ({
        ...a,
        currentPrice: generateMockPrice(a.basePrice, 0.015),
      }));
      setAssetPrices(updated);
      setTotalValue(updated.reduce((s, a) => s + a.currentPrice * a.qty, 0));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const invested  = 100000;
  const pnl       = totalValue - invested;
  const pnlPct    = ((pnl / invested) * 100).toFixed(2);
  const isUp      = pnl >= 0;

  /* Win-rate donut (simple inline SVG) */
  const winRate = 68.6;

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 style={{ color: TEXT1 }} className="text-3xl font-bold">Good morning, John! 👋</h1>
              <span style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                LIVE · Market is Open
              </span>
            </div>
            <p style={{ color: TEXT2 }} className="text-sm">Track your portfolio & follow smart trading signals in real-time.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Add Asset */}
            <button
              style={{ backgroundColor: BLUE, color: '#fff' }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2563EB'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = BLUE; }}
            >
              <Plus size={16} /> Add Asset
            </button>
            {/* View Signals */}
            <Link
              to="/signals"
              style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: BLUE, border: `1px solid rgba(59,130,246,0.4)` }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(59,130,246,0.15)'; }}
            >
              <Activity size={16} /> View Signals
            </Link>
            {!isPro && (
              <button style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT2 }}
                className="border p-2.5 rounded-xl transition-all hover:text-white">
                <Eye size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ── Stat Cards ──────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Total Portfolio */}
          <StatCard
            label="Total Portfolio Value"
            value={`$${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            change={`${pnlPct}%`}
            positive={isUp}
          >
            <svg width="45" height="22" viewBox="0 0 60 28" style={{ marginTop: '-4px', flexShrink: 0 }} className="sm:w-[60px] sm:h-[28px]">
              <polyline
                points="0,20 10,12 20,16 30,8 40,14 50,6 60,10"
                fill="none"
                stroke={isUp ? GREEN : RED}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </StatCard>

          {/* Today's P&L */}
          <StatCard label="Today's P&L" value="$1,250.45" change="5.36%" positive={true}>
            <svg width="45" height="22" viewBox="0 0 60 28" style={{ marginTop: '-4px', flexShrink: 0 }} className="sm:w-[60px] sm:h-[28px]">
              <polyline
                points="0,18 10,14 20,10 30,8 40,6 50,4 60,2"
                fill="none"
                stroke={GREEN}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </StatCard>

          {/* Total Profit */}
          <StatCard label="Total Profit" value="$5,430.20" change="28.12%" positive={true}>
            <svg width="45" height="22" viewBox="0 0 60 28" style={{ marginTop: '-4px', flexShrink: 0 }} className="sm:w-[60px] sm:h-[28px]">
              <polyline
                points="0,22 10,18 20,14 30,10 40,6 50,4 60,2"
                fill="none"
                stroke={GREEN}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </StatCard>

          {/* Win Rate - Donut Circle */}
          <div
            style={{ backgroundColor: CARD, borderColor: BORDER }}
            className="border rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-default"
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#1A2233';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = CARD;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p style={{ color: TEXT3 }} className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Win Rate</p>
                <p style={{ color: TEXT1 }} className="text-2xl sm:text-3xl font-bold">{winRate}%</p>
              </div>
              <svg width="48" height="48" viewBox="0 0 60 60" style={{ marginTop: '-4px', marginRight: '-4px', flexShrink: 0 }} className="sm:w-[60px] sm:h-[60px]">
                <circle cx="30" cy="30" r="24" fill="none" stroke={ELEVATED} strokeWidth="5" />
                <circle
                  cx="30" cy="30" r="24" fill="none" stroke={GREEN} strokeWidth="5"
                  strokeDasharray={`${(winRate / 100) * 2 * Math.PI * 24} ${2 * Math.PI * 24}`}
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Chart + Signals ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Portfolio Chart */}
          <div className="lg:col-span-2">
            <PortfolioChart
              data={BASE_CHART.map(d => ({ time: d.t, value: d.v }))}
              title="Portfolio Overview"
              showTimeFilters={true}
            />
          </div>

          {/* Trending Signals */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ color: TEXT1 }} className="text-sm font-bold flex items-center gap-2">
                <Flame size={16} style={{ color: YELLOW }} />
                Trending Signals
              </h3>
              <Link to="/signals" style={{ color: BLUE }} className="text-xs font-bold hover:opacity-80 transition-opacity">View All</Link>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {SIGNALS.map((s, i) => <SignalCard key={i} signal={s} />)}
            </div>
          </div>
        </div>

        {/* ── Your Assets Table ───────────────── */}
        <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ color: TEXT1 }} className="text-lg font-bold">Your Assets</h3>
            <Link to="/portfolio" style={{ color: BLUE }} className="text-xs font-semibold hover:opacity-80 transition-opacity">
              Manage Portfolio
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderColor: BORDER }} className="border-b">
                  {['Asset', 'Qty', 'Avg. Price', 'Current Price', '24h Change', 'P&L', 'P&L %'].map(h => (
                    <th key={h} style={{ color: TEXT3 }}
                      className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider ${h === 'Asset' ? 'text-left' : 'text-right'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assetPrices.map(a => {
                  const coin = COIN_COLORS[a.symbol] || { bg: BLUE, text: '#fff' };
                  const livePnl = (a.currentPrice - a.buyPrice) * a.qty;
                  const livePnlPct = ((a.currentPrice - a.buyPrice) / a.buyPrice * 100).toFixed(2);
                  return (
                    <tr
                      key={a.id}
                      style={{ borderColor: BORDER }}
                      className="border-b transition-all duration-150 cursor-pointer"
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div style={{ backgroundColor: coin.bg, color: coin.text }}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {a.symbol[0]}
                          </div>
                          <div>
                            <p style={{ color: TEXT1 }} className="font-semibold">{a.symbol}</p>
                            <p style={{ color: TEXT3 }} className="text-xs">{a.name}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: TEXT1 }} className="text-right py-4 px-4 font-semibold">{a.qty}</td>
                      <td style={{ color: TEXT1 }} className="text-right py-4 px-4 font-semibold">${a.buyPrice.toLocaleString()}</td>
                      <td style={{ color: TEXT1 }} className="text-right py-4 px-4 font-bold">${a.currentPrice.toLocaleString()}</td>
                      <td className="text-right py-4 px-4 font-semibold"
                        style={{ color: a.change24h >= 0 ? GREEN : RED }}>
                        <span className="flex items-center justify-end gap-1">
                          {a.change24h >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {Math.abs(a.change24h).toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right py-4 px-4 font-bold"
                        style={{ color: livePnl >= 0 ? GREEN : RED }}>
                        {livePnl >= 0 ? '+' : ''}${livePnl.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="text-right py-4 px-4 font-bold"
                        style={{ color: parseFloat(livePnlPct) >= 0 ? GREEN : RED }}>
                        {parseFloat(livePnlPct) >= 0 ? '+' : ''}{livePnlPct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Bottom Grid ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Market Overview */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ color: TEXT1 }} className="text-sm font-bold">Market Overview</h3>
              <Link to="/market" style={{ color: BLUE }} className="text-xs font-semibold hover:opacity-80">View All</Link>
            </div>
            {/* Tab: Gainers / Losers */}
            <div style={{ backgroundColor: ELEVATED }} className="flex rounded-xl p-1 gap-1 mb-4">
              {['Top Gainers', 'Top Losers'].map((t, i) => (
                <button key={t}
                  style={i === 0 ? { backgroundColor: BLUE, color: '#fff' } : { color: TEXT2 }}
                  className="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all">
                  {t}
                </button>
              ))}
            </div>
            {[
              { sym: 'PEPE/USDT', price: '$0.00001245', pct: '+18.75%', up: true },
              { sym: 'FLOKI/USDT', price: '$0.0001523', pct: '+14.32%', up: true },
              { sym: 'PYTH/USDT', price: '$0.4215', pct: '+12.45%', up: true },
            ].map(m => (
              <div key={m.sym} style={{ borderColor: BORDER }}
                className="flex items-center justify-between py-2 border-b last:border-0">
                <span style={{ color: TEXT1 }} className="text-sm font-semibold">{m.sym}</span>
                <div className="text-right">
                  <p style={{ color: TEXT1 }} className="text-xs font-semibold">{m.price}</p>
                  <p style={{ color: m.up ? GREEN : RED }} className="text-xs font-bold">{m.pct}</p>
                </div>
              </div>
            ))}
          </div>

          {/* News */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ color: TEXT1 }} className="text-sm font-bold flex items-center gap-2">
                <Newspaper size={15} /> News
              </h3>
              <Link to="/news" style={{ color: BLUE }} className="text-xs font-semibold hover:opacity-80">View All</Link>
            </div>
            <div className="space-y-1">
              {NEWS.map((n, i) => (
                <Link key={i} to="/news"
                  className="flex items-start gap-3 p-3 rounded-xl transition-all group"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{n.img}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: TEXT1 }} className="text-xs font-medium line-clamp-2 mb-1.5">{n.title}</p>
                    <div className="flex items-center gap-2">
                      <span style={{ color: TEXT3 }} className="text-[10px]">⏰ {n.time}</span>
                      <span
                        style={{
                          backgroundColor: n.sentiment === 'BULLISH' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: n.sentiment === 'BULLISH' ? GREEN : RED,
                        }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      >
                        {n.sentiment}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Watchlist */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ color: TEXT1 }} className="text-sm font-bold">Watchlist</h3>
              <Link to="/watchlist" style={{ color: BLUE }} className="text-xs font-semibold hover:opacity-80">View All</Link>
            </div>
            <div className="space-y-1">
              {assetPrices.map((a, i) => {
                const coin = COIN_COLORS[a.symbol] || { bg: BLUE, text: '#fff' };
                return (
                  <Link key={i} to="/market"
                    className="flex items-center justify-between p-3 rounded-xl transition-all"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ backgroundColor: coin.bg, color: coin.text }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {a.symbol[0]}
                      </div>
                      <div>
                        <p style={{ color: TEXT1 }} className="text-sm font-semibold">{a.symbol}</p>
                        <p style={{ color: TEXT3 }} className="text-xs">{a.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ color: TEXT1 }} className="text-sm font-bold">${a.currentPrice.toLocaleString()}</p>
                      <p style={{ color: a.change24h >= 0 ? GREEN : RED }} className="text-xs font-bold">
                        {a.change24h >= 0 ? '+' : ''}{a.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
