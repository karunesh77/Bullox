import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BookMarked, Plus, Trash2, TrendingUp, TrendingDown,
  Search, X, Star, Edit2, Check
} from 'lucide-react';
import api from '@/api/axios';
import { cn } from '@/lib/utils';

interface WatchSymbol {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  isCrypto?: boolean;
}

interface Watchlist {
  id: string;
  name: string;
  symbols: WatchSymbol[];
}

const DEFAULT_LISTS: Watchlist[] = [
  {
    id: '1',
    name: 'My Stocks',
    symbols: [
      { symbol: 'AAPL',  name: 'Apple Inc.',      price: 213.18, change: 4.87,   changePercent: 2.34,  high: 215.40, low: 208.20, isCrypto: false },
      { symbol: 'TSLA',  name: 'Tesla Inc.',       price: 192.30, change: 5.27,   changePercent: 2.81,  high: 195.00, low: 187.50, isCrypto: false },
      { symbol: 'NVDA',  name: 'NVIDIA Corp.',     price: 875.40, change: 35.60,  changePercent: 4.23,  high: 880.00, low: 840.00, isCrypto: false },
      { symbol: 'MSFT',  name: 'Microsoft Corp.',  price: 428.72, change: 3.62,   changePercent: 0.85,  high: 430.00, low: 424.00, isCrypto: false },
      { symbol: 'GOOGL', name: 'Alphabet Inc.',    price: 168.50, change: 2.23,   changePercent: 1.34,  high: 170.00, low: 165.00, isCrypto: false },
    ],
  },
  {
    id: '2',
    name: 'Crypto',
    symbols: [
      { symbol: 'BTCUSDT', name: 'Bitcoin',  price: 76243, change: 1447.2, changePercent: 1.93,  high: 77000, low: 74500, isCrypto: true },
      { symbol: 'ETHUSDT', name: 'Ethereum', price: 2332,  change: -28.4,  changePercent: -1.20, high: 2400,  low: 2300,  isCrypto: true },
      { symbol: 'SOLUSDT', name: 'Solana',   price: 183.40, change: 9.87,  changePercent: 5.67,  high: 185.00, low: 172.00, isCrypto: true },
    ],
  },
];

const SEARCH_SUGGESTIONS = [
  { symbol: 'AMZN',  name: 'Amazon.com Inc.' },
  { symbol: 'META',  name: 'Meta Platforms' },
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'TCS',   name: 'Tata Consultancy Services' },
  { symbol: 'INFY',  name: 'Infosys Ltd.' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports' },
  { symbol: 'BNBUSDT', name: 'BNB' },
  { symbol: 'XRPUSDT', name: 'XRP' },
];

function formatPrice(n: number) {
  if (n >= 1000) return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  if (n < 1) return n.toFixed(4);
  return n.toFixed(2);
}

export default function WatchlistPage() {
  const [lists, setLists] = useState<Watchlist[]>(DEFAULT_LISTS);
  const [activeId, setActiveId] = useState('1');
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const active = lists.find((l) => l.id === activeId) ?? lists[0];

  // Try to fetch live prices (falls back to mock)
  useQuery({
    queryKey: ['watchlist-prices', active?.symbols.map(s => s.symbol).join(',')],
    queryFn: async () => {
      if (!active?.symbols.length) return null;
      try {
        const symbols = active.symbols.map(s => s.symbol).join(',');
        const res = await api.get(`/market/quotes?symbols=${symbols}`);
        const quotes: Record<string, WatchSymbol> = res.data;
        setLists(prev => prev.map(list =>
          list.id === activeId
            ? { ...list, symbols: list.symbols.map(s => quotes[s.symbol] ? { ...s, ...quotes[s.symbol] } : s) }
            : list
        ));
      } catch { /* use mock */ }
      return null;
    },
    refetchInterval: 10000,
    enabled: !!active,
  });

  const addList = () => {
    if (!newListName.trim()) return;
    const id = Date.now().toString();
    setLists([...lists, { id, name: newListName.trim(), symbols: [] }]);
    setActiveId(id);
    setNewListName('');
    setShowAddList(false);
  };

  const deleteList = (id: string) => {
    const remaining = lists.filter((l) => l.id !== id);
    setLists(remaining);
    if (activeId === id) setActiveId(remaining[0]?.id ?? '');
  };

  const removeSymbol = (symbol: string) => {
    setLists(prev => prev.map(l =>
      l.id === activeId ? { ...l, symbols: l.symbols.filter(s => s.symbol !== symbol) } : l
    ));
  };

  const addSymbol = (s: { symbol: string; name: string }) => {
    if (active?.symbols.find(x => x.symbol === s.symbol)) return;
    const newSym: WatchSymbol = {
      symbol: s.symbol, name: s.name,
      price: 0, change: 0, changePercent: 0, high: 0, low: 0,
    };
    setLists(prev => prev.map(l =>
      l.id === activeId ? { ...l, symbols: [...l.symbols, newSym] } : l
    ));
    setShowSearch(false);
    setSearchQ('');
  };

  const saveEditName = (id: string) => {
    setLists(prev => prev.map(l => l.id === id ? { ...l, name: editName.trim() || l.name } : l));
    setEditingId(null);
  };

  const suggestions = SEARCH_SUGGESTIONS.filter(s =>
    s.symbol.toLowerCase().includes(searchQ.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BookMarked size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Watchlists</h1>
            <p className="text-sm text-gray-500">Track symbols you care about</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: List tabs */}
        <div className="w-52 flex-shrink-0">
          <div className="space-y-1">
            {lists.map((list) => (
              <div key={list.id} className="group relative">
                {editingId === list.id ? (
                  <div className="flex items-center gap-1 px-2 py-2">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveEditName(list.id); if (e.key === 'Escape') setEditingId(null); }}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white outline-none focus:border-green-500"
                    />
                    <button onClick={() => saveEditName(list.id)} className="text-green-400 hover:text-green-300">
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveId(list.id)}
                    className={cn(
                      'w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between gap-2',
                      activeId === list.id
                        ? 'bg-blue-500/10 text-white border border-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Star size={12} className={activeId === list.id ? 'text-blue-400' : 'text-gray-600'} />
                      <span className="truncate">{list.name}</span>
                    </div>
                    <span className="text-xs text-gray-600 flex-shrink-0">{list.symbols.length}</span>
                  </button>
                )}

                {/* Hover actions */}
                {editingId !== list.id && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-gray-900 pl-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingId(list.id); setEditName(list.name); }}
                      className="p-1 text-gray-500 hover:text-white"
                    >
                      <Edit2 size={11} />
                    </button>
                    {lists.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Add list */}
            {showAddList ? (
              <div className="flex items-center gap-1 px-2 py-2">
                <input
                  autoFocus
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addList(); if (e.key === 'Escape') setShowAddList(false); }}
                  placeholder="List name..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white placeholder-gray-500 outline-none focus:border-green-500"
                />
                <button onClick={addList} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
                <button onClick={() => setShowAddList(false)} className="text-gray-500 hover:text-gray-300"><X size={14} /></button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddList(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-green-400 transition-colors"
              >
                <Plus size={14} />
                New list
              </button>
            )}
          </div>
        </div>

        {/* Right: Symbol table */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{active?.name}</h2>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
            >
              <Plus size={14} />
              Add Symbol
            </button>
          </div>

          {/* Search dropdown */}
          {showSearch && (
            <div className="mb-4 rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
                <Search size={14} className="text-gray-500" />
                <input
                  autoFocus
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search symbol or company..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
                <button onClick={() => { setShowSearch(false); setSearchQ(''); }}>
                  <X size={14} className="text-gray-500 hover:text-white" />
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((s) => {
                  const already = active?.symbols.find(x => x.symbol === s.symbol);
                  return (
                    <button
                      key={s.symbol}
                      onClick={() => !already && addSymbol(s)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors',
                        already && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-white">{s.symbol}</span>
                        <span className="text-gray-400">{s.name}</span>
                      </div>
                      {already ? <span className="text-xs text-gray-600">Added</span> : <Plus size={12} className="text-gray-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_100px_90px_80px_80px_36px] gap-2 px-4 mb-2 text-xs text-gray-600 uppercase tracking-wider">
            <span>Symbol</span>
            <span className="text-right">Price</span>
            <span className="text-right">Change</span>
            <span className="text-right">High</span>
            <span className="text-right">Low</span>
            <span></span>
          </div>

          {/* Symbol rows */}
          {!active?.symbols.length ? (
            <div className="text-center py-16 text-gray-500">
              <BookMarked size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No symbols yet</p>
              <p className="text-xs text-gray-600 mt-1">Click "Add Symbol" to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {active.symbols.map((s) => {
                const up = s.changePercent >= 0;
                return (
                  <div
                    key={s.symbol}
                    className="group grid grid-cols-[1fr_100px_90px_80px_80px_36px] gap-2 items-center px-4 py-3 rounded-xl border border-transparent hover:border-gray-800 hover:bg-gray-900/50 transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white font-mono">{s.symbol}</p>
                      <p className="text-xs text-gray-500 truncate">{s.name}</p>
                    </div>
                    <p className="text-sm font-medium text-white text-right">
                      {s.price > 0 ? `${s.isCrypto ? '' : '$'}${formatPrice(s.price)}` : '—'}
                    </p>
                    <div className={cn('text-right', up ? 'text-green-400' : 'text-red-400')}>
                      <p className="text-sm font-medium flex items-center justify-end gap-0.5">
                        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {up ? '+' : ''}{s.changePercent.toFixed(2)}%
                      </p>
                    </div>
                    <p className="text-sm text-gray-400 text-right">{s.high > 0 ? formatPrice(s.high) : '—'}</p>
                    <p className="text-sm text-gray-400 text-right">{s.low > 0 ? formatPrice(s.low) : '—'}</p>
                    <button
                      onClick={() => removeSymbol(s.symbol)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
