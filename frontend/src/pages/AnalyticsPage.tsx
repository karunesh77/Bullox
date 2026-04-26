import { BarChart3, TrendingUp, Activity, Zap } from 'lucide-react';

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

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total P&L', value: '₹1,18,400', color: GREEN, icon: TrendingUp },
    { label: 'Return %', value: '18.40%', color: BLUE, icon: Activity },
    { label: 'Win Rate', value: '65%', color: GREEN, icon: TrendingUp },
    { label: 'Total Trades', value: '342', color: '#A78BFA', icon: Zap },
  ];

  const assetPerformance = [
    { name: 'Stocks', return: '+15.2%', color: BLUE, width: 72 },
    { name: 'Crypto', return: '+24.8%', color: GREEN, width: 85 },
    { name: 'Forex', return: '+8.3%', color: '#A78BFA', width: 45 },
    { name: 'Indices', return: '+12.1%', color: '#F59E0B', width: 62 },
  ];

  const riskMetrics = [
    { label: 'Max Drawdown', value: '-12.5%', color: RED },
    { label: 'Sharpe Ratio', value: '1.85', color: GREEN },
    { label: 'Profit Factor', value: '2.4', color: BLUE },
  ];

  const monthlyBreakdown = [
    { month: 'Jan', return: '+5.2%', trades: 42 },
    { month: 'Feb', return: '+8.1%', trades: 54 },
    { month: 'Mar', return: '+3.8%', trades: 38 },
    { month: 'Apr', return: '+12.4%', trades: 67 },
    { month: 'May', return: '+7.9%', trades: 51 },
    { month: 'Jun', return: '+9.3%', trades: 58 },
  ];

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ backgroundColor: BLUE }} className="p-2.5 rounded-xl">
              <BarChart3 size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">Advanced Analytics</h1>
              <p style={{ color: TEXT2 }} className="text-sm">Track and analyze your portfolio performance</p>
            </div>
          </div>
        </div>

        {/* ── Key Stats ─────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase">{stat.label}</p>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <p style={{ color: stat.color }} className="text-2xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* ── Performance Grid ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Asset Class Performance */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5">Performance by Asset Class</h2>
            <div className="space-y-4">
              {assetPerformance.map((asset, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: TEXT2 }} className="text-sm font-semibold">{asset.name}</span>
                    <span style={{ color: asset.color }} className="text-sm font-bold">{asset.return}</span>
                  </div>
                  <div style={{ backgroundColor: ELEVATED }} className="w-full rounded-full h-2 overflow-hidden">
                    <div
                      style={{ backgroundColor: asset.color, width: `${asset.width}%` }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Analysis */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5">Risk Analysis</h2>
            <div className="space-y-3">
              {riskMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: ELEVATED, borderColor: BORDER }}
                  className="border rounded-xl p-4"
                >
                  <p style={{ color: TEXT3 }} className="text-xs mb-1">{metric.label}</p>
                  <p style={{ color: metric.color }} className="text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Monthly Breakdown ────────────────── */}
        <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5 mb-6">
          <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5">Monthly Performance</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {monthlyBreakdown.map(month => (
              <div
                key={month.month}
                style={{ backgroundColor: ELEVATED, borderColor: BORDER }}
                className="border rounded-xl p-3 text-center"
              >
                <p style={{ color: TEXT1 }} className="font-bold text-sm mb-2">{month.month}</p>
                <p style={{ color: GREEN }} className="text-base font-bold mb-2">{month.return}</p>
                <p style={{ color: TEXT3 }} className="text-xs">{month.trades} trades</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detailed Metrics Grid ────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-3">Average Trade Return</p>
            <p style={{ color: GREEN }} className="text-3xl font-bold">+0.34%</p>
            <p style={{ color: TEXT3 }} className="text-xs mt-2">Per trade average</p>
          </div>

          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-3">Best Month</p>
            <p style={{ color: GREEN }} className="text-3xl font-bold">+12.4%</p>
            <p style={{ color: TEXT3 }} className="text-xs mt-2">April 2026</p>
          </div>

          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-3">Worst Month</p>
            <p style={{ color: RED }} className="text-3xl font-bold">-2.1%</p>
            <p style={{ color: TEXT3 }} className="text-xs mt-2">March 2026</p>
          </div>
        </div>

      </div>
    </div>
  );
}
