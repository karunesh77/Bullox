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

const MOCK_QUOTES: Quote[] = [
  { symbol: 'AAPL',    price: 213.18, change: -1.15,  changePercent: -0.54, high: 215.40, low: 211.80, open: 214.60, previousClose: 214.33 },
  { symbol: 'TSLA',    price: 192.30, change: 5.27,   changePercent:  2.81, high: 194.90, low: 188.20, open: 188.60, previousClose: 187.03 },
  { symbol: 'NVDA',    price: 875.40, change: 35.50,  changePercent:  4.23, high: 882.00, low: 855.20, open: 860.00, previousClose: 839.90 },
  { symbol: 'MSFT',    price: 428.72, change: 3.14,   changePercent:  0.74, high: 430.50, low: 424.10, open: 425.60, previousClose: 425.58 },
  { symbol: 'GOOGL',   price: 172.63, change: -0.82,  changePercent: -0.47, high: 174.20, low: 171.50, open: 173.80, previousClose: 173.45 },
];

const MOCK_CRYPTO: Quote[] = [
  { symbol: 'BTCUSDT', price: 76243, change: 1820,  changePercent:  2.44, high: 77100, low: 74800, open: 74900, previousClose: 74423, isCrypto: true },
  { symbol: 'ETHUSDT', price: 2332,  change: -28,   changePercent: -1.20, high: 2390,  low: 2310,  open: 2365,  previousClose: 2360,  isCrypto: true },
  { symbol: 'SOLUSDT', price: 183.4, change: 9.8,   changePercent:  5.67, high: 186.2, low: 175.0, open: 175.2, previousClose: 173.6, isCrypto: true },
  { symbol: 'BNBUSDT', price: 608.5, change: 12.4,  changePercent:  2.08, high: 615.0, low: 598.0, open: 598.5, previousClose: 596.1, isCrypto: true },
];

export default function MarketPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [interval, setInterval] = useState<CandleInterval>('D');
  const [searchQ, setSearchQ] = useState('');
  const [tab, setTab] = useState<'stocks' | 'crypto'>('stocks');

  // Bulk quotes for sidebar list
  const { data: quotesData, isLoading: quotesLoading, refetch } = useQuery({
    queryKey: ['bulk-quotes', DEFAULT_SYMBOLS],
    queryFn: async () => { try { return await marketApi.getBulkQuotes(DEFAULT_SYMBOLS); } catch { return null; } },
    refetchInterval: 15000,
  });

  // Selected symbol quote
  const { data: quoteData } = useQuery({
    queryKey: ['quote', selectedSymbol],
    queryFn: async () => { try { return await marketApi.getQuote(selectedSymbol); } catch { return null; } },
    refetchInterval: 10000,
  });

  // Candles for chart
  const { data: candleData, isLoading: candleLoading } = useQuery({
    queryKey: ['candles', selectedSymbol, interval],
    queryFn: async () => { try { return await marketApi.getCandles(selectedSymbol, interval); } catch { return null; } },
  });

  // Symbol search
  const { data: searchData } = useQuery({
    queryKey: ['search', searchQ],
    queryFn: async () => { try { return await marketApi.searchSymbols(searchQ); } catch { return null; } },
    enabled: searchQ.length >= 1,
  });

  // Top crypto
  const { data: cryptoData } = useQuery({
    queryKey: ['top-crypto'],
    queryFn: async () => { try { return await marketApi.getTopCrypto(); } catch { return null; } },
    refetchInterval: 30000,
  });

  const quotes: Quote[] = Array.isArray(quotesData?.data?.data) ? quotesData.data.data : MOCK_QUOTES;
  const selectedQuote: Quote | null = quoteData?.data?.data ?? quotes.find(q => q.symbol === selectedSymbol) ?? MOCK_QUOTES[0];
  const candles = Array.isArray(candleData?.data?.data) ? candleData.data.data : [];
  const searchResults: SearchResult[] = Array.isArray(searchData?.data?.data) ? searchData.data.data : [];
  const cryptoList: Quote[] = Array.isArray(cryptoData?.data?.data) ? cryptoData.data.data : MOCK_CRYPTO;

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
