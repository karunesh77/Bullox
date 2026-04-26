import { useState, useEffect } from 'react';
import { BookMarked, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

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

/* ─── Asset Categories Colors ─────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  'STOCKS': '#8B5CF6',
  'CRYPTO': '#F59E0B',
  'FOREX': '#06B6D4',
  'INDICES': '#EC4899',
};

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  change24h: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  category: 'STOCKS' | 'CRYPTO' | 'FOREX' | 'INDICES';
}

const generateMockPrice = (basePrice: number, vol = 0.02) =>
  Math.round((basePrice + (Math.random() - 0.5) * vol * basePrice) * 100) / 100;

const MOCK_WATCHLIST: WatchlistItem[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc', basePrice: 182.45, currentPrice: 182.45, change24h: 2.45, changePercent: 1.36, high: 185.20, low: 178.90, volume: '52.3M', category: 'STOCKS' },
  { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc', basePrice: 139.82, currentPrice: 139.82, change24h: -1.23, changePercent: -0.87, high: 142.15, low: 137.50, volume: '28.4M', category: 'STOCKS' },
  { id: '3', symbol: 'MSFT', name: 'Microsoft', basePrice: 424.35, currentPrice: 424.35, change24h: 5.12, changePercent: 1.22, high: 428.90, low: 418.20, volume: '19.2M', category: 'STOCKS' },
  { id: '4', symbol: 'TSLA', name: 'Tesla Inc', basePrice: 298.50, currentPrice: 298.50, change24h: 8.25, changePercent: 2.84, high: 310.20, low: 285.40, volume: '124.5M', category: 'STOCKS' },
  { id: '5', symbol: 'BTC/USDT', name: 'Bitcoin', basePrice: 68420, currentPrice: 68420, change24h: 2150, changePercent: 3.25, high: 69200, low: 66100, volume: '28.5B', category: 'CRYPTO' },
  { id: '6', symbol: 'ETH/USDT', name: 'Ethereum', basePrice: 3650, currentPrice: 3650, change24h: -125, changePercent: -3.30, high: 3850, low: 3520, volume: '18.2B', category: 'CRYPTO' },
  { id: '7', symbol: 'SOL/USDT', name: 'Solana', basePrice: 165.30, currentPrice: 165.30, change24h: 5.20, changePercent: 3.25, high: 172.50, low: 158.20, volume: '2.1B', category: 'CRYPTO' },
];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(MOCK_WATCHLIST);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  /* Real-time updates every 3s */
  useEffect(() => {
    const id = setInterval(() => {
      setWatchlist(prev =>
        prev.map(item => ({
          ...item,
          currentPrice: generateMockPrice(item.basePrice, item.category === 'CRYPTO' ? 0.03 : 0.015),
        }))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const filteredWatchlist = selectedCategory
    ? watchlist.filter(item => item.category === selectedCategory)
    : watchlist;

  const categories = ['STOCKS', 'CRYPTO', 'FOREX', 'INDICES'];

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ backgroundColor: BLUE }} className="p-2.5 rounded-xl">
              <BookMarked size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">My Watchlist</h1>
              <p style={{ color: TEXT2 }} className="text-sm">Track your favorite instruments with live prices</p>
            </div>
          </div>
        </div>

        {/* ── Category Filter ─────────────────── */}
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
                ? { backgroundColor: CATEGORY_COLORS[cat], color: '#fff' }
                : { backgroundColor: ELEVATED, color: TEXT2 }
              }
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Watchlist Table ─────────────────── */}
        <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: ELEVATED, borderColor: BORDER }} className="border-b">
                  {['Symbol', 'Name', 'Category', 'Price', '24h Change', 'High', 'Low', 'Volume', 'Action'].map(h => (
                    <th key={h} style={{ color: TEXT3 }} className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredWatchlist.map((item, idx) => {
                  const isPositive = item.change24h >= 0;
                  const catColor = CATEGORY_COLORS[item.category];
                  return (
                    <tr
                      key={item.id}
                      style={{ borderColor: BORDER }}
                      className={`border-b transition-all duration-150 cursor-pointer ${idx % 2 === 0 ? '' : ''}`}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <td style={{ color: TEXT1 }} className="py-3 px-4 font-bold">{item.symbol}</td>
                      <td style={{ color: TEXT2 }} className="py-3 px-4 text-xs">{item.name}</td>
                      <td className="py-3 px-4">
                        <span style={{ backgroundColor: catColor, color: '#fff' }} className="text-[11px] font-bold px-2.5 py-1 rounded-lg">
                          {item.category}
                        </span>
                      </td>
                      <td style={{ color: TEXT1 }} className="py-3 px-4 font-bold">
                        ${item.currentPrice.toLocaleString('en-US', { maximumFractionDigits: item.symbol.includes('BTC') ? 0 : 2 })}
                      </td>
                      <td className="py-3 px-4 font-semibold" style={{ color: isPositive ? GREEN : RED }}>
                        <span className="flex items-center gap-1">
                          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td style={{ color: TEXT2 }} className="py-3 px-4 text-xs">
                        ${item.high.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ color: TEXT2 }} className="py-3 px-4 text-xs">
                        ${item.low.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ color: TEXT3 }} className="py-3 px-4 text-xs">{item.volume}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setWatchlist(watchlist.filter(w => w.id !== item.id))}
                          style={{ color: RED }}
                          className="p-1.5 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredWatchlist.length === 0 && (
            <div className="py-12 px-4 text-center">
              <p style={{ color: TEXT2 }} className="text-sm">No items in watchlist</p>
            </div>
          )}
        </div>

        {/* ── Stats Footer ─────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-xl p-4">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-1">Total Items</p>
            <p style={{ color: TEXT1 }} className="text-2xl font-bold">{watchlist.length}</p>
          </div>
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-xl p-4">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-1">Gainers</p>
            <p style={{ color: GREEN }} className="text-2xl font-bold">{watchlist.filter(w => w.change24h >= 0).length}</p>
          </div>
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-xl p-4">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-1">Losers</p>
            <p style={{ color: RED }} className="text-2xl font-bold">{watchlist.filter(w => w.change24h < 0).length}</p>
          </div>
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-xl p-4">
            <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-1">Avg Change</p>
            <p style={{ color: watchlist.reduce((s, w) => s + w.changePercent, 0) / watchlist.length >= 0 ? GREEN : RED }} className="text-2xl font-bold">
              {(watchlist.reduce((s, w) => s + w.changePercent, 0) / watchlist.length).toFixed(2)}%
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
