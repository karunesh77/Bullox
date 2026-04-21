import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  TrendingUp, TrendingDown, Bell, BookMarked,
  Newspaper, Users, ArrowRight, Activity,
  Flame, Clock, Crown
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
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-0.5">{payload[0].payload.date}</p>
      <p className="text-white font-semibold">₹{payload[0].value.toLocaleString('en-IN')}</p>
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
    <div className="flex flex-col gap-5 max-w-7xl mx-auto">
      {/* Welcome row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {getGreeting()}, {user?.username ?? 'Trader'} 👋
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {!isPro && (
          <Link
            to="/subscription"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium hover:from-yellow-500/20 transition-all"
          >
            <Crown size={14} />
            Upgrade to Pro
            <ArrowRight size={12} />
          </Link>
        )}
      </div>

      {/* Top grid: Portfolio + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Portfolio chart */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Portfolio Value</p>
              <p className="text-3xl font-bold text-white">₹{totalValue.toLocaleString('en-IN')}</p>
              <div className={cn('flex items-center gap-1.5 mt-1 text-sm font-medium', isUp ? 'text-green-400' : 'text-red-400')}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isUp ? '+' : ''}₹{pnl.toLocaleString('en-IN')} ({isUp ? '+' : ''}{pnlPct}%) all time
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
              <Activity size={10} className="text-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#portfolioGrad)" dot={false} activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {[
            { label: 'Watchlists',     value: '2',     sub: '37 symbols',      icon: BookMarked, color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   href: '/watchlist' },
            { label: 'Active Alerts',  value: '4',     sub: '2 near target',   icon: Bell,       color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', href: '/alerts' },
            { label: 'Following',      value: '2',     sub: 'copy traders',    icon: Users,      color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20',   href: '/copy-trading' },
            { label: "Today's P&L",    value: '+1.8%', sub: '+₹1,800 today',   icon: TrendingUp, color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  href: '/market' },
          ].map((s) => (
            <Link key={s.label} to={s.href}
              className={cn('rounded-xl border p-3.5 flex items-center gap-3 hover:brightness-110 transition-all', s.bg, s.border)}
            >
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', s.bg)}>
                <s.icon size={16} className={s.color} />
              </div>
              <div>
                <p className={cn('text-lg font-bold leading-tight', s.color)}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-[10px] text-gray-600">{s.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom grid: Movers + News + Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Top Movers */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp size={14} className="text-green-400" /> Top Movers
            </h3>
            <Link to="/market" className="text-xs text-gray-500 hover:text-green-400 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {topMovers.map((m) => (
              <Link key={m.symbol} to="/market"
                className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300">
                    {m.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{m.symbol}</p>
                    <p className="text-[10px] text-gray-500">{m.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white font-medium">${m.price}</p>
                  <p className={cn('text-xs font-medium', m.up ? 'text-green-400' : 'text-red-400')}>
                    {m.change}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest News */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Newspaper size={14} className="text-purple-400" /> Latest News
            </h3>
            <Link to="/news" className="text-xs text-gray-500 hover:text-green-400 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {recentNews.map((n, i) => (
              <Link key={i} to="/news"
                className="block px-4 py-3 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn(
                    'text-[10px] font-semibold px-1.5 py-0.5 rounded-md',
                    n.sentiment === 'BULLISH' ? 'bg-green-500/10 text-green-400' :
                    n.sentiment === 'BEARISH' ? 'bg-red-500/10 text-red-400' : 'bg-gray-700 text-gray-400'
                  )}>
                    {n.sentiment}
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                    <Clock size={9} /> {n.time}
                  </span>
                </div>
                <p className="text-xs text-gray-200 leading-snug line-clamp-2">{n.title}</p>
                <p className="text-[10px] text-gray-600 mt-1">{n.source}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Flame size={14} className="text-orange-400" /> High Impact Events
            </h3>
            <Link to="/calendar" className="text-xs text-gray-500 hover:text-green-400 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {upcomingEvents.map((e, i) => (
              <Link key={i} to="/calendar"
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{e.country}</span>
                  <div>
                    <p className="text-xs text-white font-medium leading-tight">{e.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-medium">HIGH</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-yellow-400 font-medium">in {e.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
