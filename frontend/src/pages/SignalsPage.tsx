import { useState } from 'react';
import { Flame, Search } from 'lucide-react';

/* ─── Colors ─────────────────────────────────────────── */
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

interface Signal {
  id: string;
  symbol: string;
  asset: string;
  signal: 'BUY' | 'SELL';
  entry: number;
  target: number;
  stopLoss: number;
  confidence: number;
  reason: string;
  createdAt: string;
  status: 'ACTIVE' | 'CLOSED' | 'HIT_TARGET' | 'HIT_SL';
}

const MOCK_SIGNALS: Signal[] = [
  { id: '1', symbol: 'BTC/USDT', asset: 'Bitcoin', signal: 'BUY', entry: 67250, target: 71500, stopLoss: 64200, confidence: 82, reason: 'Bullish breakout from resistance', createdAt: '2h ago', status: 'ACTIVE' },
  { id: '2', symbol: 'ETH/USDT', asset: 'Ethereum', signal: 'SELL', entry: 3420, target: 3120, stopLoss: 3680, confidence: 76, reason: 'Resistance rejection at 3450', createdAt: '4h ago', status: 'ACTIVE' },
  { id: '3', symbol: 'SOL/USDT', asset: 'Solana', signal: 'BUY', entry: 165.3, target: 178.6, stopLoss: 155.2, confidence: 71, reason: 'Support bounce at 164', createdAt: '6h ago', status: 'ACTIVE' },
  { id: '4', symbol: 'BNB/USDT', asset: 'BNB', signal: 'BUY', entry: 610, target: 680, stopLoss: 580, confidence: 88, reason: 'Golden cross on daily chart', createdAt: '12h ago', status: 'ACTIVE' },
  { id: '5', symbol: 'BTC/USDT', asset: 'Bitcoin', signal: 'SELL', entry: 66800, target: 64500, stopLoss: 68900, confidence: 79, reason: 'Bearish divergence forming', createdAt: '1d ago', status: 'HIT_TARGET' },
  { id: '6', symbol: 'ETH/USDT', asset: 'Ethereum', signal: 'BUY', entry: 3200, target: 3500, stopLoss: 3000, confidence: 85, reason: 'Oversold condition recovery', createdAt: '2d ago', status: 'HIT_SL' },
];

export default function SignalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSignal, setFilterSignal] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'CLOSED'>('ACTIVE');

  // Filter signals
  const filteredSignals = MOCK_SIGNALS.filter(signal => {
    const matchesSearch = signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signal.asset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSignal = filterSignal === 'ALL' || signal.signal === filterSignal;
    const matchesStatus = filterStatus === 'ALL' || signal.status === filterStatus;
    return matchesSearch && matchesSignal && matchesStatus;
  });

  const activeBuys = MOCK_SIGNALS.filter(s => s.signal === 'BUY' && s.status === 'ACTIVE').length;
  const activeSells = MOCK_SIGNALS.filter(s => s.signal === 'SELL' && s.status === 'ACTIVE').length;
  const successRate = Math.round((MOCK_SIGNALS.filter(s => s.status === 'HIT_TARGET').length / MOCK_SIGNALS.length) * 100);

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ backgroundColor: YELLOW }} className="p-2.5 rounded-xl">
              <Flame size={20} style={{ color: '#000' }} />
            </div>
            <div>
              <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">Trading Signals</h1>
              <p style={{ color: TEXT2 }} className="text-sm">AI-powered buy and sell recommendations</p>
            </div>
          </div>
        </div>

        {/* ── Stats Cards ─────────────────────– */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-2">Active BUY Signals</p>
            <p style={{ color: GREEN }} className="text-3xl font-bold">{activeBuys}</p>
            <p style={{ color: TEXT3 }} className="text-xs mt-1">Current opportunities</p>
          </div>

          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-2">Active SELL Signals</p>
            <p style={{ color: RED }} className="text-3xl font-bold">{activeSells}</p>
            <p style={{ color: TEXT3 }} className="text-xs mt-1">Caution zones</p>
          </div>

          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-2">Success Rate</p>
            <p style={{ color: GREEN }} className="text-3xl font-bold">{successRate}%</p>
            <p style={{ color: TEXT3 }} className="text-xs mt-1">All-time accuracy</p>
          </div>
        </div>

        {/* ── Filters ─────────────────────────– */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} style={{ color: TEXT3 }} className="absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by symbol or asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ backgroundColor: CARD, borderColor: BORDER, color: TEXT1 }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Signal Filter */}
          <div style={{ backgroundColor: ELEVATED }} className="flex rounded-lg p-1 gap-1">
            {['ALL', 'BUY', 'SELL'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterSignal(t as any)}
                style={filterSignal === t
                  ? { backgroundColor: t === 'BUY' ? GREEN : t === 'SELL' ? RED : BLUE, color: '#fff' }
                  : { color: TEXT2 }
                }
                className="flex-1 px-4 py-2 text-xs font-bold rounded transition-all"
              >
                {t}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div style={{ backgroundColor: ELEVATED }} className="flex rounded-lg p-1 gap-1">
            {['ACTIVE', 'CLOSED'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterStatus(t as any)}
                style={filterStatus === t
                  ? { backgroundColor: BLUE, color: '#fff' }
                  : { color: TEXT2 }
                }
                className="flex-1 px-4 py-2 text-xs font-bold rounded transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Signals List ─────────────────────– */}
        <div className="space-y-3">
          {filteredSignals.length === 0 ? (
            <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-8 text-center">
              <p style={{ color: TEXT2 }} className="text-sm">No signals found matching your filters</p>
            </div>
          ) : (
            filteredSignals.map((signal) => {
              const isBuy = signal.signal === 'BUY';
              const coin = COIN_COLORS[signal.asset.slice(0, 3).toUpperCase()] || { bg: BLUE, text: '#fff' };
              const profitPotential = ((signal.target - signal.entry) / signal.entry * 100).toFixed(2);
              const riskReward = (Math.abs(signal.target - signal.entry) / Math.abs(signal.entry - signal.stopLoss)).toFixed(2);

              const statusColor = signal.status === 'HIT_TARGET' ? GREEN : signal.status === 'HIT_SL' ? RED : signal.status === 'ACTIVE' ? BLUE : TEXT3;
              const statusLabel = signal.status === 'HIT_TARGET' ? '✓ Target Hit' : signal.status === 'HIT_SL' ? '✕ Stop Hit' : signal.status === 'ACTIVE' ? '● Active' : 'Closed';

              return (
                <div
                  key={signal.id}
                  style={{ backgroundColor: CARD, borderColor: BORDER }}
                  className="border rounded-2xl p-5 transition-all hover:bg-opacity-90"
                >
                  {/* Row 1: Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        style={{ backgroundColor: coin.bg, color: coin.text }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      >
                        {signal.asset[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ color: TEXT1 }} className="text-sm font-bold">{signal.symbol}</p>
                        <p style={{ color: TEXT3 }} className="text-xs">{signal.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <span
                        style={isBuy
                          ? { backgroundColor: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }
                          : { backgroundColor: 'rgba(239,68,68,0.15)', color: RED, border: '1px solid rgba(239,68,68,0.3)' }
                        }
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                      >
                        {signal.signal}
                      </span>
                      <span
                        style={{ color: statusColor }}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                      >
                        {statusLabel}
                      </span>
                      <span style={{ color: BLUE }} className="text-sm font-bold flex-shrink-0">{signal.confidence}%</span>
                    </div>
                  </div>

                  {/* Row 2: Prices and Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                    <div style={{ backgroundColor: '#0B0F19' }} className="rounded-xl p-3">
                      <p style={{ color: TEXT3 }} className="text-xs mb-1">Entry</p>
                      <p style={{ color: TEXT1 }} className="font-bold text-sm">${signal.entry.toLocaleString()}</p>
                    </div>
                    <div style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }} className="rounded-xl p-3">
                      <p style={{ color: GREEN }} className="text-xs mb-1 font-semibold">Target</p>
                      <p style={{ color: GREEN }} className="font-bold text-sm">${signal.target.toLocaleString()}</p>
                    </div>
                    <div style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }} className="rounded-xl p-3">
                      <p style={{ color: RED }} className="text-xs mb-1 font-semibold">Stop Loss</p>
                      <p style={{ color: RED }} className="font-bold text-sm">${signal.stopLoss.toLocaleString()}</p>
                    </div>
                    <div style={{ backgroundColor: ELEVATED }} className="rounded-xl p-3">
                      <p style={{ color: TEXT3 }} className="text-xs mb-1">Profit</p>
                      <p style={{ color: GREEN }} className="font-bold text-sm">{profitPotential}%</p>
                    </div>
                    <div style={{ backgroundColor: ELEVATED }} className="rounded-xl p-3">
                      <p style={{ color: TEXT3 }} className="text-xs mb-1">R:R</p>
                      <p style={{ color: BLUE }} className="font-bold text-sm">1:{riskReward}</p>
                    </div>
                  </div>

                  {/* Row 3: Confidence Bar and Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div style={{ backgroundColor: '#0B0F19' }} className="h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${signal.confidence}%`, backgroundColor: isBuy ? GREEN : RED }}
                          className="h-full rounded-full transition-all"
                        />
                      </div>
                    </div>
                    <p style={{ color: TEXT3 }} className="text-xs ml-4 flex-shrink-0">{signal.createdAt}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
