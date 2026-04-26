import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Plus, Minus, PieChart } from 'lucide-react';

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

interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  category: string;
  categoryColor: string;
  allocation: number;
}

const INITIAL_POSITIONS: Position[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', quantity: 0.35, avgPrice: 56200, currentPrice: 67260.5, category: 'Crypto', categoryColor: '#F7931A', allocation: 35 },
  { id: '2', symbol: 'ETH', name: 'Ethereum', quantity: 2.15, avgPrice: 2850, currentPrice: 3420.25, category: 'Crypto', categoryColor: '#627EEA', allocation: 28 },
  { id: '3', symbol: 'AAPL', name: 'Apple Inc', quantity: 50, avgPrice: 140, currentPrice: 182.45, category: 'Stocks', categoryColor: '#8B5CF6', allocation: 20 },
  { id: '4', symbol: 'MSFT', name: 'Microsoft', quantity: 20, avgPrice: 300, currentPrice: 424.35, category: 'Stocks', categoryColor: '#8B5CF6', allocation: 17 },
];

const generateMockPrice = (basePrice: number, vol = 0.015) =>
  Math.round((basePrice + (Math.random() - 0.5) * vol * basePrice) * 100) / 100;

export default function PortfolioPage() {
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  /* Real-time price updates every 3 seconds */
  useEffect(() => {
    const id = setInterval(() => {
      setPositions(prev =>
        prev.map(position => ({
          ...position,
          currentPrice: generateMockPrice(position.currentPrice, 0.015),
        }))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Calculate portfolio stats
  const totalValue = positions.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0);
  const totalInvested = positions.reduce((sum, p) => sum + (p.avgPrice * p.quantity), 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPct = ((totalGain / totalInvested) * 100).toFixed(2);
  const isPositive = totalGain >= 0;

  // Filter positions by category
  const filteredPositions = selectedCategory
    ? positions.filter(p => p.category === selectedCategory)
    : positions;

  const categories = [...new Set(positions.map(p => p.category))];

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ backgroundColor: BLUE }} className="p-2.5 rounded-xl">
              <PieChart size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">Portfolio Management</h1>
              <p style={{ color: TEXT2 }} className="text-sm">View and manage your investments</p>
            </div>
          </div>
        </div>

        {/* ── Portfolio Summary Cards ─────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">

          {/* Total Value */}
          <div
            style={{ backgroundColor: CARD, borderColor: BORDER }}
            className="border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:bg-opacity-90"
          >
            <p style={{ color: TEXT3 }} className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Total Portfolio Value</p>
            <p style={{ color: TEXT1 }} className="text-2xl sm:text-3xl font-bold mb-2">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p style={{ color: isPositive ? GREEN : RED }} className="text-sm font-semibold flex items-center gap-1">
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? '+' : ''}{totalGainPct}%
            </p>
          </div>

          {/* Total Invested */}
          <div
            style={{ backgroundColor: CARD, borderColor: BORDER }}
            className="border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:bg-opacity-90"
          >
            <p style={{ color: TEXT3 }} className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Total Invested</p>
            <p style={{ color: TEXT1 }} className="text-2xl sm:text-3xl font-bold mb-2">${totalInvested.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p style={{ color: TEXT3 }} className="text-sm">Capital deployed</p>
          </div>

          {/* Total Gain/Loss */}
          <div
            style={{ backgroundColor: CARD, borderColor: BORDER }}
            className="border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:bg-opacity-90"
          >
            <p style={{ color: TEXT3 }} className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Total Gain/Loss</p>
            <p style={{ color: isPositive ? GREEN : RED }} className="text-2xl sm:text-3xl font-bold mb-2">
              {isPositive ? '+' : ''}${Math.abs(totalGain).toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
            <p style={{ color: isPositive ? GREEN : RED }} className="text-sm font-semibold">
              {isPositive ? 'Profit' : 'Loss'}
            </p>
          </div>

          {/* Asset Count */}
          <div
            style={{ backgroundColor: CARD, borderColor: BORDER }}
            className="border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:bg-opacity-90"
          >
            <p style={{ color: TEXT3 }} className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">Asset Count</p>
            <p style={{ color: TEXT1 }} className="text-2xl sm:text-3xl font-bold mb-2">{positions.length}</p>
            <p style={{ color: TEXT3 }} className="text-sm">{categories.length} categories</p>
          </div>

        </div>

        {/* ── Portfolio Allocation ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">

          {/* Allocation Chart */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5 lg:col-span-2">
            <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-6">Portfolio Allocation</h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Pie Chart Visualization */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle cx="100" cy="100" r="80" fill="none" stroke={ELEVATED} strokeWidth="30" />

                  {/* Animated segments */}
                  {positions.map((position, index) => {
                    let offset = 0;
                    for (let i = 0; i < index; i++) {
                      offset += positions[i].allocation;
                    }
                    const circumference = 2 * Math.PI * 80;
                    const segmentLength = (position.allocation / 100) * circumference;
                    const segmentOffset = (offset / 100) * circumference;

                    return (
                      <circle
                        key={position.id}
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke={position.categoryColor}
                        strokeWidth="30"
                        strokeDasharray={`${segmentLength} ${circumference}`}
                        strokeDashoffset={-segmentOffset}
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p style={{ color: TEXT1 }} className="text-2xl font-bold">{totalGainPct}%</p>
                    <p style={{ color: TEXT3 }} className="text-xs">Total Return</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-3">
                {positions.map(position => {
                  const value = position.currentPrice * position.quantity;
                  const pct = ((value / totalValue) * 100).toFixed(1);
                  return (
                    <div key={position.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: position.categoryColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <p style={{ color: TEXT1 }} className="text-sm font-semibold">{position.symbol}</p>
                          <p style={{ color: TEXT3 }} className="text-xs">{position.name}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p style={{ color: TEXT1 }} className="text-sm font-bold">{pct}%</p>
                        <p style={{ color: TEXT3 }} className="text-xs">${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5">Quick Stats</h2>

            <div className="space-y-4">
              <div>
                <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-2">Best Performer</p>
                {(() => {
                  const best = positions.reduce((prev, curr) => {
                    const prevGain = (curr.currentPrice - curr.avgPrice) / curr.avgPrice;
                    const currGain = (prev.currentPrice - prev.avgPrice) / prev.avgPrice;
                    return prevGain > currGain ? curr : prev;
                  });
                  const gainPct = (((best.currentPrice - best.avgPrice) / best.avgPrice) * 100).toFixed(2);
                  return (
                    <div style={{ backgroundColor: ELEVATED }} className="rounded-lg p-3">
                      <p style={{ color: TEXT1 }} className="font-bold text-sm">{best.symbol}</p>
                      <p style={{ color: GREEN }} className="text-sm font-bold mt-1">+{gainPct}%</p>
                    </div>
                  );
                })()}
              </div>

              <div>
                <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-2">Most Holdings</p>
                {(() => {
                  const most = positions.reduce((prev, curr) => curr.quantity > prev.quantity ? curr : prev);
                  return (
                    <div style={{ backgroundColor: ELEVATED }} className="rounded-lg p-3">
                      <p style={{ color: TEXT1 }} className="font-bold text-sm">{most.symbol}</p>
                      <p style={{ color: TEXT2 }} className="text-sm mt-1">{most.quantity} units</p>
                    </div>
                  );
                })()}
              </div>

              <div>
                <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-2">Diversification</p>
                <div style={{ backgroundColor: ELEVATED }} className="rounded-lg p-3">
                  <p style={{ color: GREEN }} className="font-bold text-sm">Well Diversified</p>
                  <p style={{ color: TEXT2 }} className="text-xs mt-1">{categories.length} asset types</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Category Filter ─────────────────────── */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            style={!selectedCategory
              ? { backgroundColor: BLUE, color: '#fff' }
              : { backgroundColor: ELEVATED, color: TEXT2 }
            }
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            All Assets
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={selectedCategory === cat
                ? { backgroundColor: BLUE, color: '#fff' }
                : { backgroundColor: ELEVATED, color: TEXT2 }
              }
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Positions Table ─────────────────────── */}
        <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
          <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5">Your Positions</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: ELEVATED, borderColor: BORDER }} className="border-b">
                  {['Asset', 'Quantity', 'Avg. Price', 'Current Price', 'Gain/Loss', 'Return %', 'Value', 'Action'].map(h => (
                    <th key={h} style={{ color: TEXT3 }} className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPositions.map((position, idx) => {
                  const totalValue = position.currentPrice * position.quantity;
                  const totalInvested = position.avgPrice * position.quantity;
                  const gain = totalValue - totalInvested;
                  const gainPct = ((gain / totalInvested) * 100).toFixed(2);
                  const isUp = gain >= 0;

                  return (
                    <tr
                      key={position.id}
                      style={{ borderColor: BORDER }}
                      className={`border-b transition-all ${idx % 2 === 0 ? '' : ''}`}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: position.categoryColor }}
                          >
                            {position.symbol[0]}
                          </div>
                          <div>
                            <p style={{ color: TEXT1 }} className="font-semibold">{position.symbol}</p>
                            <p style={{ color: TEXT3 }} className="text-xs">{position.name}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: TEXT1 }} className="py-4 px-4 font-semibold">{position.quantity}</td>
                      <td style={{ color: TEXT1 }} className="py-4 px-4">${position.avgPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                      <td style={{ color: TEXT1 }} className="py-4 px-4 font-bold">${position.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                      <td className="py-4 px-4 font-bold" style={{ color: isUp ? GREEN : RED }}>
                        {isUp ? '+' : ''}${gain.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 font-bold" style={{ color: isUp ? GREEN : RED }}>
                        <span className="flex items-center gap-1">
                          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {isUp ? '+' : ''}{gainPct}%
                        </span>
                      </td>
                      <td style={{ color: TEXT1 }} className="py-4 px-4 font-bold">
                        ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <button
                          style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: GREEN }}
                          className="p-2 rounded-lg hover:bg-opacity-30 transition-all"
                          title="Add"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: RED }}
                          className="p-2 rounded-lg hover:bg-opacity-30 transition-all"
                          title="Sell"
                        >
                          <Minus size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
