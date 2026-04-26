import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';
import PortfolioChart from '@/components/charts/PortfolioChart';

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

interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  basePrice?: number;
}

type CandleInterval = '1' | '5' | '15' | '30' | '60' | 'D' | 'W';

const generateMockPrice = (basePrice: number, vol = 0.02) =>
  Math.round((basePrice + (Math.random() - 0.5) * vol * basePrice) * 100) / 100;

const INTERVALS: { label: string; value: CandleInterval }[] = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1h', value: '60' },
  { label: '1D', value: 'D' },
  { label: '1W', value: 'W' },
];

const BASE_QUOTES: (Quote & { basePrice: number })[] = [
  { symbol: 'AAPL',    basePrice: 213.18, price: 213.18, change: -1.15,  changePercent: -0.54, high: 215.40, low: 211.80, open: 214.60, previousClose: 214.33 },
  { symbol: 'TSLA',    basePrice: 192.30, price: 192.30, change: 5.27,   changePercent:  2.81, high: 194.90, low: 188.20, open: 188.60, previousClose: 187.03 },
  { symbol: 'NVDA',    basePrice: 875.40, price: 875.40, change: 35.50,  changePercent:  4.23, high: 882.00, low: 855.20, open: 860.00, previousClose: 839.90 },
  { symbol: 'MSFT',    basePrice: 428.72, price: 428.72, change: 3.14,   changePercent:  0.74, high: 430.50, low: 424.10, open: 425.60, previousClose: 425.58 },
  { symbol: 'GOOGL',   basePrice: 172.63, price: 172.63, change: -0.82,  changePercent: -0.47, high: 174.20, low: 171.50, open: 173.80, previousClose: 173.45 },
];

const BASE_CRYPTO: (Quote & { basePrice: number })[] = [
  { symbol: 'BTC/USDT', basePrice: 76243, price: 76243, change: 1820,  changePercent:  2.44, high: 77100, low: 74800, open: 74900, previousClose: 74423 },
  { symbol: 'ETH/USDT', basePrice: 2332,  price: 2332,  change: -28,   changePercent: -1.20, high: 2390,  low: 2310,  open: 2365,  previousClose: 2360 },
  { symbol: 'SOL/USDT', basePrice: 183.4, price: 183.4, change: 9.8,   changePercent:  5.67, high: 186.2, low: 175.0, open: 175.2, previousClose: 173.6 },
  { symbol: 'BNB/USDT', basePrice: 608.5, price: 608.5, change: 12.4,  changePercent:  2.08, high: 615.0, low: 598.0, open: 598.5, previousClose: 596.1 },
];

// Mock chart data
const generateChartData = () => {
  const data = [];
  let baseValue = 100000;
  for (let i = 0; i < 24; i++) {
    baseValue += (Math.random() - 0.5) * baseValue * 0.02;
    data.push({
      time: `${String(i).padStart(2, '0')}:00`,
      value: Math.round(baseValue),
    });
  }
  return data;
};

export default function MarketPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [selectedInterval, setSelectedInterval] = useState<CandleInterval>('D');
  const [searchQ, setSearchQ] = useState('');
  const [tab, setTab] = useState<'stocks' | 'crypto'>('stocks');
  const [quotes, setQuotes] = useState<Quote[]>(BASE_QUOTES);
  const [cryptoList, setCryptoList] = useState<Quote[]>(BASE_CRYPTO);
  const [chartData] = useState(generateChartData());

  // Real-time price updates
  useEffect(() => {
    const id = setInterval(() => {
      setQuotes(prev =>
        prev.map(q => ({
          ...q,
          price: generateMockPrice(q.basePrice ?? q.price, 0.015),
        }))
      );
      setCryptoList(prev =>
        prev.map(q => ({
          ...q,
          price: generateMockPrice(q.basePrice ?? q.price, 0.03),
        }))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const selectedQuote = [...quotes, ...cryptoList].find(q => q.symbol === selectedSymbol) || quotes[0];
  const filteredList = tab === 'stocks' ? quotes : cryptoList;
  const filteredBySearch = filteredList.filter(q => q.symbol.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-4">

        {/* ── Header with Quote ─────────────────── */}
        {selectedQuote && (
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p style={{ color: TEXT2 }} className="text-xs font-semibold uppercase mb-1">Market Quote</p>
                <h2 style={{ color: TEXT1 }} className="text-2xl font-bold">{selectedQuote.symbol}</h2>
              </div>
              <div>
                <p style={{ color: TEXT1 }} className="text-3xl font-bold">
                  ${selectedQuote.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
                <p
                  style={{ color: selectedQuote.changePercent >= 0 ? GREEN : RED }}
                  className="text-sm font-bold flex items-center gap-1 mt-1"
                >
                  {selectedQuote.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {selectedQuote.changePercent >= 0 ? '+' : ''}{selectedQuote.changePercent.toFixed(2)}%
                </p>
              </div>
              <div className="flex gap-3 text-sm ml-auto">
                <div style={{ backgroundColor: ELEVATED }} className="px-3 py-2 rounded-lg">
                  <p style={{ color: TEXT3 }} className="text-xs mb-1">High</p>
                  <p style={{ color: TEXT1 }} className="font-bold">${selectedQuote.high.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>
                <div style={{ backgroundColor: ELEVATED }} className="px-3 py-2 rounded-lg">
                  <p style={{ color: TEXT3 }} className="text-xs mb-1">Low</p>
                  <p style={{ color: TEXT1 }} className="font-bold">${selectedQuote.low.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>
                <div style={{ backgroundColor: ELEVATED }} className="px-3 py-2 rounded-lg">
                  <p style={{ color: TEXT3 }} className="text-xs mb-1">Open</p>
                  <p style={{ color: TEXT1 }} className="font-bold">${selectedQuote.open.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              <button style={{ backgroundColor: ELEVATED, color: TEXT2 }} className="p-2.5 rounded-lg hover:text-white transition-all">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Main Grid ─────────────────────── */}
        <div className="flex gap-4 flex-1">

          {/* ── Left: Symbol List ──────────────── */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="w-64 border rounded-2xl flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b" style={{ borderColor: BORDER }}>
              <div className="relative">
                <Search size={14} style={{ color: TEXT3 }} className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm placeholder-shown:text-gray-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Tabs */}
            <div style={{ backgroundColor: ELEVATED }} className="flex p-1.5 gap-1 mx-3 mt-3 rounded-lg">
              {(['stocks', 'crypto'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setSelectedSymbol(t === 'stocks' ? quotes[0].symbol : cryptoList[0].symbol); }}
                  style={tab === t
                    ? { backgroundColor: BLUE, color: '#fff' }
                    : { color: TEXT2 }
                  }
                  className="flex-1 py-1 text-xs font-bold rounded-md transition-all"
                >
                  {t === 'stocks' ? 'Stocks' : 'Crypto'}
                </button>
              ))}
            </div>

            {/* Symbol List */}
            <div className="flex-1 overflow-y-auto">
              {filteredBySearch.length === 0 ? (
                <div className="py-4 px-3">
                  <p style={{ color: TEXT3 }} className="text-xs text-center">No results</p>
                </div>
              ) : (
                filteredBySearch.map(q => (
                  <button
                    key={q.symbol}
                    onClick={() => setSelectedSymbol(q.symbol)}
                    style={{
                      backgroundColor: selectedSymbol === q.symbol ? ELEVATED : 'transparent',
                      borderColor: BORDER,
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 border-b text-sm transition-all hover:bg-opacity-50"
                  >
                    <div className="text-left">
                      <p style={{ color: TEXT1 }} className="font-bold text-xs">{q.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: TEXT1 }} className="font-bold text-xs">${q.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                      <p style={{ color: q.changePercent >= 0 ? GREEN : RED }} className="text-[10px] font-bold">
                        {q.changePercent >= 0 ? '+' : ''}{q.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Right: Chart ────────────────────── */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Interval Buttons */}
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {INTERVALS.map(i => (
                <button
                  key={i.value}
                  onClick={() => setSelectedInterval(i.value)}
                  style={selectedInterval === i.value
                    ? { backgroundColor: BLUE, color: '#fff' }
                    : { backgroundColor: CARD, borderColor: BORDER, color: TEXT2 }
                  }
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold border transition-all hover:text-white"
                >
                  {i.label}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-0">
              <PortfolioChart
                data={chartData}
                title={`${selectedSymbol} Market`}
                subtitle="24-hour trading activity"
                showTimeFilters={false}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
