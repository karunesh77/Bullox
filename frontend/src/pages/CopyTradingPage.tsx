import { useState } from 'react';
import { Users, Star, Shield, Zap, Award, ChevronDown, ChevronUp, UserCheck, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Trader {
  id: string;
  name: string;
  username: string;
  avatar: string;
  badge?: 'PRO' | 'VERIFIED' | 'TOP';
  returnPercent: number;
  returnMonth: number;
  winRate: number;
  followers: number;
  trades: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  topSymbols: string[];
  bio: string;
  isFollowing: boolean;
  equity: number;
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
    returnMonth: 18.4,
    winRate: 74,
    followers: 12400,
    trades: 1842,
    riskLevel: 'MEDIUM',
    topSymbols: ['AAPL', 'NVDA', 'TSLA'],
    bio: 'Momentum trader. 8 years exp. Focus on US tech & AI stocks.',
    isFollowing: true,
    equity: 2400000,
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
    returnMonth: 9.2,
    winRate: 68,
    followers: 8700,
    trades: 3210,
    riskLevel: 'LOW',
    topSymbols: ['EURUSD', 'BTCUSDT', 'GOLD'],
    bio: 'Forex & crypto swing trader. Risk-first approach. CFA Level 2.',
    isFollowing: false,
    equity: 980000,
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
    returnMonth: 24.1,
    winRate: 61,
    followers: 5200,
    trades: 9870,
    riskLevel: 'HIGH',
    topSymbols: ['SOLUSDT', 'AVAXUSDT', 'NVDA'],
    bio: 'Quant algo trader. High frequency crypto + US equities. High risk.',
    isFollowing: false,
    equity: 3800000,
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
    returnMonth: 6.8,
    winRate: 79,
    followers: 15600,
    trades: 642,
    riskLevel: 'LOW',
    topSymbols: ['RELIANCE', 'TCS', 'HDFC'],
    bio: 'Long-term value investor. Indian equities specialist. 12 years exp.',
    isFollowing: true,
    equity: 1200000,
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
    returnMonth: 15.7,
    winRate: 65,
    followers: 9300,
    trades: 5420,
    riskLevel: 'HIGH',
    topSymbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
    bio: 'Full-time crypto trader since 2017. DeFi & altcoin cycles expert.',
    isFollowing: false,
    equity: 1850000,
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
    returnMonth: 11.3,
    winRate: 72,
    followers: 6800,
    trades: 2130,
    riskLevel: 'MEDIUM',
    topSymbols: ['NIFTY', 'BANKNIFTY', 'SENSEX'],
    bio: 'Options & derivatives trader. Indian indices & F&O specialist.',
    isFollowing: false,
    equity: 750000,
    maxDrawdown: 14.8,
    chart: [45, 50, 48, 58, 62, 60, 68, 72, 70, 78, 82, 85],
  },
];

const riskConfig = {
  LOW:    { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  label: 'Low Risk' },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Med Risk' },
  HIGH:   { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    label: 'High Risk' },
};

const badgeConfig = {
  TOP:      { icon: Award,  color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'TOP' },
  VERIFIED: { icon: Shield, color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   label: 'VERIFIED' },
  PRO:      { icon: Zap,    color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', label: 'PRO' },
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
      'rounded-2xl border transition-all duration-200',
      trader.isFollowing ? 'border-green-500/30 bg-green-500/5' : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-900'
    )}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-600/20 border border-gray-700 flex items-center justify-center text-base font-bold text-white">
              {trader.avatar}
            </div>
            {trader.isFollowing && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <UserCheck size={10} className="text-gray-950" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-base font-bold text-white">{trader.name}</span>
              {badge && BadgeIcon && (
                <span className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border', badge.bg, badge.border, badge.color)}>
                  <BadgeIcon size={9} />
                  {badge.label}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2">{trader.username}</p>

            {/* Stats row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <p className="text-xs text-gray-500">All-time return</p>
                <p className={cn('text-lg font-bold', up ? 'text-green-400' : 'text-red-400')}>
                  {up ? '+' : ''}{trader.returnPercent}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">This month</p>
                <p className={cn('text-sm font-semibold', trader.returnMonth >= 0 ? 'text-green-400' : 'text-red-400')}>
                  {trader.returnMonth >= 0 ? '+' : ''}{trader.returnMonth}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Win rate</p>
                <p className="text-sm font-semibold text-white">{trader.winRate}%</p>
              </div>
              <div className="ml-auto hidden sm:block">
                <Sparkline data={trader.chart} up={up} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn('px-2 py-1 rounded-lg text-xs font-medium border', risk.bg, risk.border, risk.color)}>
              {risk.label}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Star size={10} className="text-yellow-400" />
              {trader.followers.toLocaleString()} followers
            </span>
            <div className="flex gap-1">
              {trader.topSymbols.map(s => (
                <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{s}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              onClick={() => onToggleFollow(trader.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95',
                trader.isFollowing
                  ? 'bg-gray-800 text-gray-300 hover:bg-red-500/10 hover:text-red-400 border border-gray-700'
                  : 'bg-green-500 text-gray-950 hover:bg-green-400'
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
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-gray-800/50 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Trades</p>
              <p className="text-base font-bold text-white">{trader.trades.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-gray-800/50 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Max Drawdown</p>
              <p className="text-base font-bold text-red-400">-{trader.maxDrawdown}%</p>
            </div>
            <div className="rounded-xl bg-gray-800/50 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Equity</p>
              <p className="text-base font-bold text-white">₹{(trader.equity / 100000).toFixed(1)}L</p>
            </div>
            <div className="rounded-xl bg-gray-800/50 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Win Rate</p>
              <p className="text-base font-bold text-green-400">{trader.winRate}%</p>
            </div>
            <div className="col-span-2 sm:col-span-4 rounded-xl bg-gray-800/50 p-3">
              <p className="text-xs text-gray-500 mb-1">About</p>
              <p className="text-sm text-gray-300">{trader.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CopyTradingPage() {
  const [traders, setTraders] = useState<Trader[]>(MOCK_TRADERS);
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [sortBy, setSortBy] = useState<'return' | 'winrate' | 'followers'>('return');

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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Users size={18} className="text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Copy Trading</h1>
            <p className="text-sm text-gray-500">Follow top traders · Mirror their moves</p>
          </div>
        </div>

        {following.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <UserCheck size={14} className="text-green-400" />
            <span className="text-sm text-green-400 font-medium">Following {following.length} trader{following.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Top Return', value: '+421%', sub: 'Arjun Mehta', color: 'text-green-400' },
          { label: 'Best Win Rate', value: '79%', sub: 'Sneha Patel', color: 'text-blue-400' },
          { label: 'Most Followed', value: '15.6K', sub: 'Sneha Patel', color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters & sort */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 p-1 bg-gray-900 rounded-xl">
          {(['all', 'following'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                filter === f ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              {f === 'following' ? `Following (${following.length})` : 'All Traders'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Sort by:</span>
          {([['return', 'Return'], ['winrate', 'Win Rate'], ['followers', 'Followers']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSortBy(val)}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-all',
                sortBy === val ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
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
          <button onClick={() => setFilter('all')} className="mt-2 text-sm text-green-400 hover:text-green-300">
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
  );
}
