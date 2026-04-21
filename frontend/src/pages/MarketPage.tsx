import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import { marketApi } from '@/api/market';
interface Quote { symbol: string; price: number; change: number; changePercent: number; high: number; low: number; open: number; previousClose: number; volume?: number; isCrypto?: boolean; }
interface SearchResult { symbol: string; description: string; type: string; }
type CandleInterval = '1' | '5' | '15' | '30' | '60' | 'D' | 'W';
import { formatPrice, formatPercent, cn } from '@/lib/utils';
import CandleChart from '@/components/market/CandleChart';

const INTERVALS: { label: string; value: CandleInterval }[] = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1h', value: '60' },
  { label: '1D', value: 'D' },
  { label: '1W', value: 'W' },
];

const DEFAULT_SYMBOLS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'BTCUSDT', 'ETHUSDT'];

export default function MarketPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [interval, setInterval] = useState<CandleInterval>('D');
  const [searchQ, setSearchQ] = useState('');
  const [tab, setTab] = useState<'stocks' | 'crypto'>('stocks');

  // Bulk quotes for sidebar list
  const { data: quotesData, isLoading: quotesLoading, refetch } = useQuery({
    queryKey: ['bulk-quotes', DEFAULT_SYMBOLS],
    queryFn: () => marketApi.getBulkQuotes(DEFAULT_SYMBOLS),
    refetchInterval: 15000,
  });

  // Selected symbol quote
  const { data: quoteData } = useQuery({
    queryKey: ['quote', selectedSymbol],
    queryFn: () => marketApi.getQuote(selectedSymbol),
    refetchInterval: 10000,
  });

  // Candles for chart
  const { data: candleData, isLoading: candleLoading } = useQuery({
    queryKey: ['candles', selectedSymbol, interval],
    queryFn: () => marketApi.getCandles(selectedSymbol, interval),
  });

  // Symbol search
  const { data: searchData } = useQuery({
    queryKey: ['search', searchQ],
    queryFn: () => marketApi.searchSymbols(searchQ),
    enabled: searchQ.length >= 1,
  });

  // Top crypto
  const { data: cryptoData } = useQuery({
    queryKey: ['top-crypto'],
    queryFn: () => marketApi.getTopCrypto(),
    refetchInterval: 30000,
  });

  const quotes: Quote[] = quotesData?.data?.data ?? [];
  const selectedQuote: Quote | null = quoteData?.data?.data ?? null;
  const candles = candleData?.data?.data ?? [];
  const searchResults: SearchResult[] = searchData?.data?.data ?? [];
  const cryptoList: Quote[] = cryptoData?.data?.data ?? [];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Selected symbol header */}
      {selectedQuote && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-4 flex flex-wrap items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">{selectedQuote.symbol}</h2>
            <p className="text-xs text-gray-500">Live Quote</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">${formatPrice(selectedQuote.price)}</span>
            <span className={cn('text-sm font-medium flex items-center gap-1', selectedQuote.changePercent >= 0 ? 'text-green-400' : 'text-red-400')}>
              {selectedQuote.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {formatPercent(selectedQuote.changePercent)}
            </span>
          </div>
          <div className="flex gap-4 ml-auto text-xs text-gray-500">
            <span>H: <span className="text-gray-300">${formatPrice(selectedQuote.high)}</span></span>
            <span>L: <span className="text-gray-300">${formatPrice(selectedQuote.low)}</span></span>
            <span>O: <span className="text-gray-300">${formatPrice(selectedQuote.open)}</span></span>
          </div>
          <button onClick={() => refetch()} className="ml-auto text-gray-500 hover:text-white transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
      )}

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left — Symbol List */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search symbol..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Search results */}
          {searchQ && searchResults.length > 0 && (
            <div className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
              {searchResults.slice(0, 6).map((r) => (
                <button
                  key={r.symbol}
                  onClick={() => { setSelectedSymbol(r.symbol); setSearchQ(''); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-0"
                >
                  <span className="font-medium text-white">{r.symbol}</span>
                  <span className="text-gray-500 text-xs ml-2 truncate">{r.description}</span>
                </button>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-800 p-1 gap-1">
            {(['stocks', 'crypto'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn('flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors',
                  tab === t ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Symbol list */}
          <div className="flex-1 rounded-xl border border-gray-800 bg-gray-900 overflow-y-auto">
            {quotesLoading && (
              <div className="flex items-center justify-center h-20 text-gray-600 text-sm">Loading...</div>
            )}
            {(tab === 'stocks' ? quotes.filter(q => !q.isCrypto) : cryptoList).map((q) => (
              <button
                key={q.symbol}
                onClick={() => setSelectedSymbol(q.symbol)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 text-sm border-b border-gray-800 last:border-0 hover:bg-gray-800/60 transition-colors',
                  selectedSymbol === q.symbol && 'bg-green-500/5 border-l-2 border-l-green-500'
                )}
              >
                <span className="font-medium text-white">{q.symbol}</span>
                <div className="text-right">
                  <p className="text-xs text-gray-300">${formatPrice(q.price)}</p>
                  <p className={cn('text-xs', q.changePercent >= 0 ? 'text-green-400' : 'text-red-400')}>
                    {formatPercent(q.changePercent)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — Chart */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Interval selector */}
          <div className="flex gap-1">
            {INTERVALS.map((i) => (
              <button
                key={i.value}
                onClick={() => setInterval(i.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  interval === i.value
                    ? 'bg-green-500 text-gray-950'
                    : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                )}
              >
                {i.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 rounded-xl border border-gray-800 bg-gray-900 overflow-hidden min-h-80">
            {candleLoading ? (
              <div className="flex items-center justify-center h-full text-gray-600 text-sm">
                Loading chart...
              </div>
            ) : candles.length > 0 ? (
              <CandleChart candles={candles} symbol={selectedSymbol} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <p className="text-gray-600 text-sm">No chart data</p>
                <p className="text-gray-700 text-xs">Connect Finnhub API key to see live charts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
