import { useState, useEffect } from 'react';
import { Users, Star, Shield, Zap, Award, ChevronDown, ChevronUp, UserCheck, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Real-time mock data generator
const generateRandomOffset = (baseValue: number, volatility: number = 0.02): number => {
  const change = (Math.random() - 0.5) * volatility * baseValue;
  return Math.round(change * 100) / 100;
};

interface Trader {
  id: string;
  name: string;
  username: string;
  avatar: string;
  badge?: 'PRO' | 'VERIFIED' | 'TOP';
  returnPercent: number;
  baseReturnPercent: number;
  returnMonth: number;
  baseReturnMonth: number;
  winRate: number;
  followers: number;
  trades: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  topSymbols: string[];
  bio: string;
  isFollowing: boolean;
  equity: number;
  baseEquity: number;
  maxDrawdown: number;
  chart: number[]; // mini sparkline
}

const MOCK_TRADERS: Trader[] = [
  {
    id: '1',
    name: 'Rakesh Sharma',
    username: '@rakesh_trades',
    avatar: 'RS',
    badge: 'TOP',
    returnPercent: 284,
    baseReturnPercent: 284,
    returnMonth: 18.4,
    baseReturnMonth: 18.4,
    winRate: 74,
    followers: 12400,
    trades: 1842,
    riskLevel: 'MEDIUM',
    topSymbols: ['AAPL', 'NVDA', 'TSLA'],
    bio: 'Momentum trader. 8 years exp. Focus on US tech & AI stocks.',
    isFollowing: true,
    equity: 2400000,
    baseEquity: 2400000,
    maxDrawdown: 12.3,
    chart: [40, 45, 42, 55, 58, 62, 59, 70, 75, 80, 78, 90],
  },
  {
    id: '2',
    name: 'Priya Kapoor',
    username: '@priya_fx',
    avatar: 'PK',
    badge: 'VERIFIED',
    returnPercent: 156,
    baseReturnPercent: 156,
    returnMonth: 9.2,
    baseReturnMonth: 9.2,
    winRate: 68,
    followers: 8700,
    trades: 3210,
    riskLevel: 'LOW',
    topSymbols: ['EURUSD', 'BTCUSDT', 'GOLD'],
    bio: 'Forex & crypto swing trader. Risk-first approach. CFA Level 2.',
    isFollowing: false,
    equity: 980000,
    baseEquity: 980000,
    maxDrawdown: 7.1,
    chart: [50, 52, 54, 51, 58, 60, 63, 61, 68, 72, 75, 78],
  },
  {
    id: '3',
    name: 'Arjun Mehta',
    username: '@arjun_quant',
    avatar: 'AM',
    badge: 'PRO',
    returnPercent: 421,
    baseReturnPercent: 421,
    returnMonth: 24.1,
    baseReturnMonth: 24.1,
    winRate: 61,
    followers: 5200,
    trades: 9870,
    riskLevel: 'HIGH',
    topSymbols: ['SOLUSDT', 'AVAXUSDT', 'NVDA'],
    bio: 'Quant algo trader. High frequency crypto + US equities. High risk.',
    isFollowing: false,
    equity: 3800000,
    baseEquity: 3800000,
    maxDrawdown: 28.4,
    chart: [30, 45, 35, 60, 50, 80, 65, 95, 75, 110, 90, 130],
  },
  {
    id: '4',
    name: 'Sneha Patel',
    username: '@sneha_invest',
    avatar: 'SP',
    badge: 'VERIFIED',
    returnPercent: 98,
    baseReturnPercent: 98,
    returnMonth: 6.8,
    baseReturnMonth: 6.8,
    winRate: 79,
    followers: 15600,
    trades: 642,
    riskLevel: 'LOW',
    topSymbols: ['RELIANCE', 'TCS', 'HDFC'],
    bio: 'Long-term value investor. Indian equities specialist. 12 years exp.',
    isFollowing: true,
    equity: 1200000,
    baseEquity: 1200000,
    maxDrawdown: 5.2,
    chart: [60, 62, 63, 65, 64, 67, 68, 70, 71, 73, 75, 76],
  },
  {
    id: '5',
    name: 'Vikram Das',
    username: '@vikram_crypto',
    avatar: 'VD',
    badge: 'PRO',
    returnPercent: 312,
    baseReturnPercent: 312,
    returnMonth: 15.7,
    baseReturnMonth: 15.7,
    winRate: 65,
    followers: 9300,
    trades: 5420,
    riskLevel: 'HIGH',
    topSymbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
    bio: 'Full-time crypto trader since 2017. DeFi & altcoin cycles expert.',
    isFollowing: false,
    equity: 1850000,
    baseEquity: 1850000,
    maxDrawdown: 22.1,
    chart: [40, 50, 45, 65, 55, 85, 70, 100, 85, 115, 95, 125],
  },
  {
    id: '6',
    name: 'Ananya Joshi',
    username: '@ananya_options',
    avatar: 'AJ',
    badge: 'VERIFIED',
    returnPercent: 187,
    baseReturnPercent: 187,
    returnMonth: 11.3,
    baseReturnMonth: 11.3,
    winRate: 72,
    followers: 6800,
    trades: 2130,
    riskLevel: 'MEDIUM',
    topSymbols: ['NIFTY', 'BANKNIFTY', 'SENSEX'],
    bio: 'Options & derivatives trader. Indian indices & F&O specialist.',
    isFollowing: false,
    equity: 750000,
    baseEquity: 750000,
    maxDrawdown: 14.8,
    chart: [45, 50, 48, 58, 62, 60, 68, 72, 70, 78, 82, 85],
  },
];

const riskConfig = {
  LOW:    { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300', label: 'Low Risk' },
  MEDIUM: { color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-300', label: 'Med Risk' },
  HIGH:   { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300', label: 'High Risk' },
};

const badgeConfig = {
  TOP:      { icon: Award,  color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-300', label: 'TOP' },
  VERIFIED: { icon: Shield, color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-300',   label: 'VERIFIED' },
  PRO:      { icon: Zap,    color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-300', label: 'PRO' },
};

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const color = up ? '#22c55e' : '#ef4444';

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TraderCard({ trader, onToggleFollow }: { trader: Trader; onToggleFollow: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const risk = riskConfig[trader.riskLevel];
  const badge = trader.badge ? badgeConfig[trader.badge] : null;
  const BadgeIcon = badge?.icon;
  const up = trader.returnPercent > 0;

  return (
    <div className={cn(
      'rounded-2xl border transition-all duration-200 p-5',
      trader.isFollowing ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : 'bg-white border-gray-200 hover:shadow-lg'
    )}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 border border-gray-300 flex items-center justify-center text-base font-bold text-gray-900">
            {trader.avatar}
          </div>
          {trader.isFollowing && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
              <UserCheck size={10} className="text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-base font-bold text-gray-900">{trader.name}</span>
            {badge && BadgeIcon && (
              <span className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border', badge.bg, badge.border, badge.color)}>
                <BadgeIcon size={9} />
                {badge.label}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-2">{trader.username}</p>

          {/* Stats row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-xs text-gray-600">All-time return</p>
              <p className={cn('text-lg font-bold', up ? 'text-green-700' : 'text-red-700')}>
                {up ? '+' : ''}{trader.returnPercent}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">This month</p>
              <p className={cn('text-sm font-semibold', trader.returnMonth >= 0 ? 'text-green-700' : 'text-red-700')}>
                {trader.returnMonth >= 0 ? '+' : ''}{trader.returnMonth}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Win rate</p>
              <p className="text-sm font-semibold text-gray-900">{trader.winRate}%</p>
            </div>
            <div className="ml-auto hidden sm:block">
              <Sparkline data={trader.chart} up={up} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn('px-2 py-1 rounded-lg text-xs font-medium border', risk.bg, risk.border, risk.color)}>
              {risk.label}
            </span>
            <span className="text-xs text-gray-700 flex items-center gap-1">
              <Star size={10} className="text-yellow-500" />
              {trader.followers.toLocaleString()} followers
            </span>
            <div className="flex gap-1">
              {trader.topSymbols.map(s => (
                <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">{s}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              onClick={() => onToggleFollow(trader.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95',
                trader.isFollowing
                  ? 'bg-white text-red-700 hover:bg-red-50 border border-red-300'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
              )}
            >
              {trader.isFollowing ? (
                <><UserCheck size={14} /> Following</>
              ) : (
                <><UserPlus size={14} /> Follow</>
              )}
            </button>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-3 text-center border border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Total Trades</p>
              <p className="text-base font-bold text-gray-900">{trader.trades.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 p-3 text-center border border-red-200">
              <p className="text-xs text-gray-600 mb-1">Max Drawdown</p>
              <p className="text-base font-bold text-red-700">-{trader.maxDrawdown}%</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-3 text-center border border-purple-200">
              <p className="text-xs text-gray-600 mb-1">Equity</p>
              <p className="text-base font-bold text-gray-900">₹{(trader.equity / 100000).toFixed(1)}L</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-3 text-center border border-green-200">
              <p className="text-xs text-gray-600 mb-1">Win Rate</p>
              <p className="text-base font-bold text-green-700">{trader.winRate}%</p>
            </div>
            <div className="col-span-2 sm:col-span-4 rounded-xl bg-gray-50 p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">About</p>
              <p className="text-sm text-gray-700">{trader.bio}</p>
            </div>
          </div>
        )}
    </div>
  );
}

export default function CopyTradingPage() {
  const [traders, setTraders] = useState<Trader[]>(MOCK_TRADERS);
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [sortBy, setSortBy] = useState<'return' | 'winrate' | 'followers'>('return');

  // Real-time updates for trader returns and equity every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTraders(prev =>
        prev.map(trader => ({
          ...trader,
          equity: trader.baseEquity + generateRandomOffset(trader.baseEquity, 0.01),
          returnPercent: Math.max(0, trader.baseReturnPercent + generateRandomOffset(trader.baseReturnPercent, 0.02)),
          returnMonth: trader.baseReturnMonth + generateRandomOffset(trader.baseReturnMonth, 0.04),
        }))
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleFollow = (id: string) => {
    setTraders(prev => prev.map(t => t.id === id ? { ...t, isFollowing: !t.isFollowing } : t));
  };

  const following = traders.filter(t => t.isFollowing);

  const sorted = [...traders]
    .filter(t => filter === 'following' ? t.isFollowing : true)
    .sort((a, b) => {
      if (sortBy === 'return') return b.returnPercent - a.returnPercent;
      if (sortBy === 'winrate') return b.winRate - a.winRate;
      return b.followers - a.followers;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100">
                <Users size={24} className="text-purple-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Copy Trading</h1>
                <p className="text-sm text-gray-600">Follow top traders · Mirror their moves</p>
              </div>
            </div>

            {following.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300">
                <UserCheck size={16} className="text-green-700" />
                <span className="text-sm text-green-800 font-bold">Following {following.length} trader{following.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Stats banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Top Return', value: '+421%', sub: 'Arjun Mehta', color: 'text-green-700' },
              { label: 'Best Win Rate', value: '79%', sub: 'Sneha Patel', color: 'text-blue-700' },
              { label: 'Most Followed', value: '15.6K', sub: 'Sneha Patel', color: 'text-purple-700' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 text-center hover:shadow-md transition-all">
                <p className="text-xs text-gray-600 font-semibold mb-1">{s.label}</p>
                <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
                <p className="text-xs text-gray-600 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters & sort */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-200">
            {(['all', 'following'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-bold transition-all',
                  filter === f ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {f === 'following' ? `Following (${following.length})` : 'All Traders'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
            <span>Sort by:</span>
            {([['return', 'Return'], ['winrate', 'Win Rate'], ['followers', 'Followers']] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                className={cn(
                  'px-3 py-2 rounded-lg transition-all text-xs font-bold',
                  sortBy === val ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Traders */}
        {sorted.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Not following anyone yet</p>
            <button onClick={() => setFilter('all')} className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-bold">
              Browse all traders
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((trader) => (
              <TraderCard key={trader.id} trader={trader} onToggleFollow={toggleFollow} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
