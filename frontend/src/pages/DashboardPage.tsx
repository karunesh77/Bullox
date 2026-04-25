import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  TrendingUp, TrendingDown, Newspaper,
  ArrowRight, Activity, Flame, Clock, Crown
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { cn } from '@/lib/utils';

// Mock portfolio P&L chart data
const portfolioData = [
  { date: 'Apr 1',  value: 100000 },
  { date: 'Apr 3',  value: 102400 },
  { date: 'Apr 5',  value: 101200 },
  { date: 'Apr 7',  value: 105800 },
  { date: 'Apr 9',  value: 103600 },
  { date: 'Apr 11', value: 108200 },
  { date: 'Apr 13', value: 107400 },
  { date: 'Apr 15', value: 112000 },
  { date: 'Apr 17', value: 110500 },
  { date: 'Apr 19', value: 115800 },
  { date: 'Apr 21', value: 118400 },
];

const topMovers = [
  { symbol: 'NVDA',    name: 'Nvidia Corp',  price: '875.40',  change: '+4.23%', up: true },
  { symbol: 'TSLA',    name: 'Tesla Inc',    price: '192.30',  change: '+2.81%', up: true },
  { symbol: 'SOLUSDT', name: 'Solana',       price: '183.40',  change: '+5.67%', up: true },
  { symbol: 'AAPL',    name: 'Apple Inc',    price: '213.18',  change: '-0.54%', up: false },
  { symbol: 'ETHUSDT', name: 'Ethereum',     price: '2,332',   change: '-1.20%', up: false },
];

const recentNews = [
  { title: 'Fed signals rate cut in Q2 2026 as inflation cools', sentiment: 'BULLISH', source: 'Reuters', time: '15m ago' },
  { title: 'NVIDIA reports record Q4 revenue, AI chip demand soars', sentiment: 'BULLISH', source: 'Bloomberg', time: '45m ago' },
  { title: 'Tesla shares drop on disappointing delivery numbers', sentiment: 'BEARISH', source: 'CNBC', time: '2h ago' },
];

const upcomingEvents = [
  { title: 'US Non-Farm Payrolls', time: '2h', impact: 'HIGH', country: '🇺🇸' },
  { title: 'RBI Repo Rate Decision', time: '6h', impact: 'HIGH', country: '🇮🇳' },
  { title: 'US CPI (MoM)', time: '9h', impact: 'HIGH', country: '🇺🇸' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-600 mb-0.5">{payload[0].payload.date}</p>
      <p className="text-blue-600 font-semibold">₹{payload[0].value.toLocaleString('en-IN')}</p>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isPro = user?.role === 'PRO' || user?.role === 'EXPERT';

  const totalValue  = 118400;
  const invested    = 100000;
  const pnl         = totalValue - invested;
  const pnlPct      = ((pnl / invested) * 100).toFixed(2);
  const isUp        = pnl >= 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {getGreeting()}, {user?.username ?? 'Trader'} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {!isPro && (
            <Link
              to="/subscription"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold hover:shadow-lg transition-all shadow-md"
            >
              <Crown size={16} />
              Upgrade to Pro
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Portfolio Value', value: `₹${totalValue.toLocaleString('en-IN')}`, sub: isUp ? `+₹${pnl.toLocaleString('en-IN')} (${pnlPct}%)` : `-₹${Math.abs(pnl).toLocaleString('en-IN')} (${pnlPct}%)`, icon: '📊', gradient: 'from-blue-500 to-cyan-500', light: 'from-blue-50 to-cyan-50' },
              { label: 'Watchlists', value: '2', sub: '37 symbols', icon: '⭐', gradient: 'from-purple-500 to-pink-500', light: 'from-purple-50 to-pink-50' },
              { label: 'Active Alerts', value: '4', sub: '2 near target', icon: '🔔', gradient: 'from-orange-500 to-red-500', light: 'from-orange-50 to-red-50' },
              { label: "Today's P&L", value: '+1.8%', sub: '+₹1,800', icon: '📈', gradient: 'from-green-500 to-emerald-500', light: 'from-green-50 to-emerald-50' },
            ].map((stat) => (
              <div key={stat.label} className={cn('rounded-2xl p-5 border border-gray-200 bg-gradient-to-br', stat.light, 'shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all')}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-600 uppercase tracking-wider font-bold">{stat.label}</p>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className={cn('text-2xl font-bold mb-2 bg-gradient-to-r', stat.gradient, 'bg-clip-text text-transparent')}>{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Portfolio Chart */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider font-bold mb-2">Portfolio Performance</p>
                  <div className="flex items-baseline gap-4">
                    <p className="text-4xl font-bold text-gray-900">₹{totalValue.toLocaleString('en-IN')}</p>
                    <div className={cn('flex items-center gap-1 px-3 py-1 rounded-lg font-semibold text-sm', isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                      {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span>{isUp ? '+' : '-'}{pnlPct}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300">
                  <Activity size={14} className="text-green-600 animate-pulse" />
                  <span className="text-xs text-green-700 font-bold">LIVE</span>
                </div>
              </div>
            </div>
            <div className="p-6 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} interval={2} />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fill="url(#portfolioGrad)" dot={false} activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Top Movers */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-200">
                    <TrendingUp size={16} className="text-green-700" />
                  </div>
                  Top Movers
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {topMovers.map((m) => (
                  <Link key={m.symbol} to="/market"
                    className="flex items-center justify-between px-6 py-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">{m.symbol}</p>
                      <p className="text-xs text-gray-600 mt-1">{m.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">${m.price}</p>
                      <p className={cn('text-sm font-bold', m.up ? 'text-green-600' : 'text-red-600')}>
                        {m.change}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-200">
                    <Newspaper size={16} className="text-blue-700" />
                  </div>
                  Latest News
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentNews.map((n, i) => (
                  <Link key={i} to="/news"
                    className="block px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'text-[11px] font-bold px-2.5 py-1 rounded-full',
                        n.sentiment === 'BULLISH' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' :
                        n.sentiment === 'BEARISH' ? 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700' : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700'
                      )}>
                        {n.sentiment}
                      </span>
                      <span className="text-[10px] text-gray-500">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-900 font-medium leading-snug line-clamp-2">{n.title}</p>
                    <p className="text-[10px] text-gray-500 mt-2">{n.source}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-200">
                    <Flame size={16} className="text-orange-700" />
                  </div>
                  High Impact Events
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {upcomingEvents.map((e, i) => (
                  <Link key={i} to="/calendar"
                    className="flex items-center justify-between px-6 py-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{e.country}</span>
                      <div>
                        <p className="text-sm text-gray-900 font-medium">{e.title}</p>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-700 font-bold inline-block mt-1">HIGH</span>
                      </div>
                    </div>
                    <p className="text-xs text-orange-600 font-bold whitespace-nowrap">in {e.time}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
