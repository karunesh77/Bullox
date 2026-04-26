import { useState, useEffect } from 'react';
import { Users, Star, Shield, Zap, Award, ChevronDown, ChevronUp, UserCheck, UserPlus } from 'lucide-react';

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

const generateRandomOffset = (baseValue: number, vol = 0.02) =>
  Math.round((baseValue + (Math.random() - 0.5) * vol * baseValue) * 100) / 100;

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
  chart: number[];
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
    topSymbols: ['EURUSD', 'BTC/USDT', 'GOLD'],
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
    topSymbols: ['SOL/USDT', 'AVAX/USDT', 'NVDA'],
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
    topSymbols: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
    bio: 'Full-time crypto trader since 2017. DeFi & altcoin cycles expert.',
    isFollowing: false,
    equity: 1850000,
    baseEquity: 1850000,
    maxDrawdown: 22.1,
    chart: [40, 50, 45, 65, 55, 85, 70, 100, 85, 115, 95, 125],
  },
];

const riskConfig = {
  LOW: { color: GREEN, label: 'Low Risk' },
  MEDIUM: { color: YELLOW, label: 'Med Risk' },
  HIGH: { color: RED, label: 'High Risk' },
};

const badgeConfig = {
  TOP: { icon: Award, color: YELLOW, label: 'TOP' },
  VERIFIED: { icon: Shield, color: BLUE, label: 'VERIFIED' },
  PRO: { icon: Zap, color: '#A78BFA', label: 'PRO' },
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
  const color = up ? GREEN : RED;

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
    <div
      style={{ backgroundColor: trader.isFollowing ? ELEVATED : CARD, borderColor: BORDER }}
      className="border rounded-2xl transition-all duration-150 p-4"
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = trader.isFollowing ? ELEVATED : CARD; }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div style={{ backgroundColor: ELEVATED, color: TEXT1 }} className="w-12 h-12 rounded-xl border border-blue-500 flex items-center justify-center text-sm font-bold">
            {trader.avatar}
          </div>
          {trader.isFollowing && (
            <div style={{ backgroundColor: GREEN }} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center">
              <UserCheck size={10} style={{ color: '#000' }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span style={{ color: TEXT1 }} className="text-sm font-bold">{trader.name}</span>
            {badge && BadgeIcon && (
              <span style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: badge.color, border: '1px solid rgba(59,130,246,0.3)' }} className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                <BadgeIcon size={9} />
                {badge.label}
              </span>
            )}
          </div>
          <p style={{ color: TEXT3 }} className="text-xs mb-2">{trader.username}</p>

          {/* Stats row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p style={{ color: TEXT3 }} className="text-xs mb-0.5">All-time return</p>
              <p style={{ color: up ? GREEN : RED }} className="text-base font-bold">
                {up ? '+' : ''}{trader.returnPercent}%
              </p>
            </div>
            <div>
              <p style={{ color: TEXT3 }} className="text-xs mb-0.5">This month</p>
              <p style={{ color: trader.returnMonth >= 0 ? GREEN : RED }} className="text-sm font-semibold">
                {trader.returnMonth >= 0 ? '+' : ''}{trader.returnMonth}%
              </p>
            </div>
            <div>
              <p style={{ color: TEXT3 }} className="text-xs mb-0.5">Win rate</p>
              <p style={{ color: TEXT1 }} className="text-sm font-semibold">{trader.winRate}%</p>
            </div>
            <div className="ml-auto hidden sm:block">
              <Sparkline data={trader.chart} up={up} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ borderColor: BORDER }} className="flex items-center justify-between mt-4 pt-4 border-t flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: risk.color, border: '1px solid rgba(59,130,246,0.3)' }} className="px-2 py-1 rounded-lg text-xs font-medium">
            {risk.label}
          </span>
          <span style={{ color: TEXT2 }} className="text-xs flex items-center gap-1">
            <Star size={11} style={{ color: YELLOW }} />
            {trader.followers.toLocaleString()} followers
          </span>
          <div className="flex gap-1">
            {trader.topSymbols.map(s => (
              <span key={s} style={{ backgroundColor: ELEVATED, color: BLUE }} className="text-[10px] font-mono px-1.5 py-0.5 rounded">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ color: TEXT2 }}
            className="p-2 rounded-lg hover:bg-opacity-50 transition-all"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={() => onToggleFollow(trader.id)}
            style={{
              backgroundColor: trader.isFollowing ? ELEVATED : BLUE,
              color: trader.isFollowing ? RED : '#fff',
              borderColor: trader.isFollowing ? RED : 'transparent',
              border: trader.isFollowing ? '1px solid' : 'none',
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            {trader.isFollowing ? (
              <><UserCheck size={13} /> Following</>
            ) : (
              <><UserPlus size={13} /> Follow</>
            )}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ borderColor: BORDER }} className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div style={{ backgroundColor: ELEVATED }} className="rounded-xl p-3 text-center">
            <p style={{ color: TEXT3 }} className="text-xs mb-1">Total Trades</p>
            <p style={{ color: TEXT1 }} className="text-sm font-bold">{trader.trades.toLocaleString()}</p>
          </div>
          <div style={{ backgroundColor: ELEVATED }} className="rounded-xl p-3 text-center">
            <p style={{ color: TEXT3 }} className="text-xs mb-1">Max Drawdown</p>
            <p style={{ color: RED }} className="text-sm font-bold">-{trader.maxDrawdown}%</p>
          </div>
          <div style={{ backgroundColor: ELEVATED }} className="rounded-xl p-3 text-center">
            <p style={{ color: TEXT3 }} className="text-xs mb-1">Equity</p>
            <p style={{ color: TEXT1 }} className="text-sm font-bold">₹{(trader.equity / 100000).toFixed(1)}L</p>
          </div>
          <div style={{ backgroundColor: ELEVATED }} className="rounded-xl p-3 text-center">
            <p style={{ color: TEXT3 }} className="text-xs mb-1">Win Rate</p>
            <p style={{ color: GREEN }} className="text-sm font-bold">{trader.winRate}%</p>
          </div>
          <div style={{ backgroundColor: ELEVATED }} className="col-span-2 sm:col-span-4 rounded-xl p-3">
            <p style={{ color: TEXT3 }} className="text-xs mb-2">About</p>
            <p style={{ color: TEXT2 }} className="text-xs">{trader.bio}</p>
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

  useEffect(() => {
    const id = setInterval(() => {
      setTraders(prev =>
        prev.map(trader => ({
          ...trader,
          equity: trader.baseEquity + generateRandomOffset(trader.baseEquity, 0.01),
          returnPercent: Math.max(0, trader.baseReturnPercent + generateRandomOffset(trader.baseReturnPercent, 0.02)),
          returnMonth: trader.baseReturnMonth + generateRandomOffset(trader.baseReturnMonth, 0.04),
        }))
      );
    }, 3000);
    return () => clearInterval(id);
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
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: BLUE }} className="p-2.5 rounded-xl">
                <Users size={20} style={{ color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">Copy Trading</h1>
                <p style={{ color: TEXT2 }} className="text-sm">Follow top traders · Mirror their moves</p>
              </div>
            </div>

            {following.length > 0 && (
              <div style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }} className="flex items-center gap-2 px-4 py-3 rounded-xl">
                <UserCheck size={16} />
                <span className="text-sm font-bold">Following {following.length} trader{following.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Stats banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Top Return', value: '+421%', sub: 'Arjun Mehta', color: GREEN },
              { label: 'Best Win Rate', value: '79%', sub: 'Sneha Patel', color: BLUE },
              { label: 'Most Followed', value: '15.6K', sub: 'Sneha Patel', color: YELLOW },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-xl p-4 text-center">
                <p style={{ color: TEXT3 }} className="text-xs font-semibold mb-2">{s.label}</p>
                <p style={{ color: s.color }} className="text-2xl font-bold">{s.value}</p>
                <p style={{ color: TEXT3 }} className="text-xs mt-2">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filters & sort ────────────────────── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div style={{ backgroundColor: ELEVATED }} className="flex gap-1 p-1 rounded-xl">
            {(['all', 'following'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={filter === f
                  ? { backgroundColor: BLUE, color: '#fff' }
                  : { color: TEXT2 }
                }
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                {f === 'following' ? `Following (${following.length})` : 'All Traders'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs" style={{ color: TEXT3 }}>
            <span className="font-bold">Sort by:</span>
            {([['return', 'Return'], ['winrate', 'Win Rate'], ['followers', 'Followers']] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                style={sortBy === val
                  ? { backgroundColor: BLUE, color: '#fff' }
                  : { backgroundColor: ELEVATED, color: TEXT2, borderColor: BORDER }
                }
                className="px-3 py-2 rounded-lg transition-all text-xs font-bold border"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Traders List ────────────────────── */}
        {sorted.length === 0 ? (
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl py-16 px-4 text-center">
            <Users size={40} style={{ color: TEXT3 }} className="mx-auto mb-3 opacity-50" />
            <p style={{ color: TEXT2 }} className="text-sm">Not following anyone yet</p>
            <button onClick={() => setFilter('all')} style={{ color: BLUE }} className="mt-3 text-xs font-bold hover:opacity-80 transition-opacity">
              Browse all traders
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map(trader => (
              <TraderCard key={trader.id} trader={trader} onToggleFollow={toggleFollow} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
