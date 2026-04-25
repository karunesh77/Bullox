import { useState } from 'react';
import { BookMarked, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  category: 'STOCKS' | 'CRYPTO' | 'FOREX' | 'INDICES';
}

const MOCK_WATCHLIST: WatchlistItem[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc', price: 182.45, change: 2.45, changePercent: 1.36, high: 185.20, low: 178.90, volume: '52.3M', category: 'STOCKS' },
  { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc', price: 139.82, change: -1.23, changePercent: -0.87, high: 142.15, low: 137.50, volume: '28.4M', category: 'STOCKS' },
  { id: '3', symbol: 'MSFT', name: 'Microsoft Corp', price: 424.35, change: 5.12, changePercent: 1.22, high: 428.90, low: 418.20, volume: '19.2M', category: 'STOCKS' },
  { id: '4', symbol: 'BTCUSDT', name: 'Bitcoin', price: 68420, change: 2150, changePercent: 3.25, high: 69200, low: 66100, volume: '28.5B', category: 'CRYPTO' },
];

function WatchlistCard({ item, onRemove }: { item: WatchlistItem; onRemove: (id: string) => void }) {
  const isPositive = item.change >= 0;

  return (
    <div className="p-5 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-lg font-bold text-gray-900">{item.symbol}</p>
          <p className="text-xs text-gray-600">{item.name}</p>
        </div>
        <button onClick={() => onRemove(item.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
          <Trash2 size={18} />
        </button>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{item.price}</p>
        <div className={cn('text-sm font-bold px-3 py-1 rounded-lg', isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
          {isPositive ? <TrendingUp size={14} className="inline" /> : <TrendingDown size={14} className="inline" />} {Math.abs(item.change).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(MOCK_WATCHLIST);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100">
            <BookMarked size={24} className="text-blue-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">My Watchlist</h1>
            <p className="text-sm text-gray-600">Track your favorite instruments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {watchlist.map((item) => (
            <WatchlistCard key={item.id} item={item} onRemove={(id) => setWatchlist(watchlist.filter((w) => w.id !== id))} />
          ))}
        </div>
      </div>
    </div>
  );
}
