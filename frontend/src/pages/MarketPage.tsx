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

const MOCK_CANDLES = [
  { time: '2026-04-15', open: 200, high: 205, low: 198, close: 202, volume: 1000000 },
  { time: '2026-04-16', open: 202, high: 210, low: 200, close: 208, volume: 1200000 },
  { time: '2026-04-17', open: 208, high: 215, low: 206, close: 212, volume: 1100000 },
  { time: '2026-04-18', open: 212, high: 218, low: 210, close: 215, volume: 900000 },
  { time: '2026-04-19', open: 215, high: 220, low: 213, close: 218, volume: 1050000 },
  { time: '2026-04-20', open: 218, high: 222, low: 216, close: 220, volume: 1300000 },
  { time: '2026-04-21', open: 220, high: 225, low: 218, close: 223, volume: 1150000 },
  { time: '2026-04-22', open: 223, high: 228, low: 221, close: 226, volume: 1400000 },
  { time: '2026-04-23', open: 226, high: 232, low: 224, close: 230, volume: 1600000 },
  { time: '2026-04-24', open: 230, high: 235, low: 228, close: 233, volume: 1500000 },
  { time: '2026-04-25', open: 233, high: 238, low: 231, close: 237, volume: 1700000 },
];

export default function MarketPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [interval, setInterval] = useState<CandleInterval>('D');
  const [searchQ, setSearchQ] = useState('');
  const [tab, setTab] = useState<'stocks' | 'crypto'>('stocks');

  const quotesLoading = false;
  const candleLoading = false;

  const quotes: Quote[] = MOCK_QUOTES;
  const selectedQuote: Quote | null = quotes.find(q => q.symbol === selectedSymbol) ?? MOCK_QUOTES[0];
  const candles = MOCK_CANDLES;
  const searchResults: SearchResult[] = [];
  const cryptoList: Quote[] = MOCK_CRYPTO;

  const refetch = () => {};

  return (
    <div className="flex flex-col gap-4 h-full p-6 bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Selected symbol header */}
      {selectedQuote && (
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 flex flex-wrap items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
            <TrendingUp size={20} className="text-blue-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{selectedQuote.symbol}</h2>
            <p className="text-xs text-gray-500">Live Quote</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">${formatPrice(selectedQuote.price)}</span>
            <span className={cn('text-sm font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg', selectedQuote.changePercent >= 0 ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' : 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700')}>
              {selectedQuote.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {formatPercent(selectedQuote.changePercent)}
            </span>
          </div>
          <div className="flex gap-4 ml-auto text-xs text-gray-600">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-200">H: <span className="text-gray-900 font-bold">${formatPrice(selectedQuote.high)}</span></span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-200">L: <span className="text-gray-900 font-bold">${formatPrice(selectedQuote.low)}</span></span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-gray-200">O: <span className="text-gray-900 font-bold">${formatPrice(selectedQuote.open)}</span></span>
          </div>
          <button onClick={() => refetch()} className="ml-auto text-gray-500 hover:text-blue-600 transition-colors p-2 hover:bg-blue-100 rounded-lg">
            <RefreshCw size={16} />
          </button>
        </div>
      )}

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left — Symbol List */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbol..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Search results */}
          {searchQ && searchResults.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
              {searchResults.slice(0, 6).map((r) => (
                <button
                  key={r.symbol}
                  onClick={() => { setSelectedSymbol(r.symbol); setSearchQ(''); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium text-gray-900">{r.symbol}</span>
                  <span className="text-gray-600 text-xs ml-2 truncate">{r.description}</span>
                </button>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1 gap-1">
            {(['stocks', 'crypto'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn('flex-1 py-2 text-xs font-bold rounded-md capitalize transition-all',
                  tab === t ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Symbol list */}
          <div className="flex-1 rounded-2xl border border-gray-200 bg-white overflow-y-auto shadow-sm">
            {quotesLoading && (
              <div className="flex items-center justify-center h-20 text-gray-500 text-sm">Loading...</div>
            )}
            {(tab === 'stocks' ? quotes.filter(q => !q.isCrypto) : cryptoList).map((q) => (
              <button
                key={q.symbol}
                onClick={() => setSelectedSymbol(q.symbol)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 text-sm border-b border-gray-100 last:border-0 transition-all',
                  selectedSymbol === q.symbol
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600'
                    : 'hover:bg-gray-50'
                )}
              >
                <span className="font-bold text-gray-900">{q.symbol}</span>
                <div className="text-right">
                  <p className="text-xs text-gray-900 font-bold">${formatPrice(q.price)}</p>
                  <p className={cn('text-xs font-bold', q.changePercent >= 0 ? 'text-green-600' : 'text-red-600')}>
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
          <div className="flex gap-2 flex-wrap">
            {INTERVALS.map((i) => (
              <button
                key={i.value}
                onClick={() => setInterval(i.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm',
                  interval === i.value
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                {i.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="flex-1 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 overflow-hidden min-h-80 shadow-sm">
            {candleLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Loading chart...
              </div>
            ) : candles.length > 0 ? (
              <CandleChart candles={candles} symbol={selectedSymbol} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <p className="text-gray-600 text-sm">No chart data</p>
                <p className="text-gray-500 text-xs">Connect Finnhub API key to see live charts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
