import { useState } from 'react';
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink, Clock, Flame } from 'lucide-react';

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

interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentimentScore?: number;
  impact?: 'HIGH' | 'MEDIUM' | 'LOW';
  affectedSymbols?: string[];
  category?: string;
}

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Stocks', value: 'STOCKS' },
  { label: 'Crypto', value: 'CRYPTO' },
  { label: 'Forex', value: 'FOREX' },
  { label: 'Economy', value: 'ECONOMY' },
];

const SENTIMENTS = [
  { label: 'All', value: '' },
  { label: 'Bullish', value: 'BULLISH' },
  { label: 'Bearish', value: 'BEARISH' },
  { label: 'Neutral', value: 'NEUTRAL' },
];

const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Fed signals possible rate cut in Q2 2026 as inflation cools',
    summary: 'Powell hints at easing monetary policy following three consecutive months of declining CPI figures.',
    url: '#',
    source: 'Reuters',
    publishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    sentiment: 'BULLISH',
    sentimentScore: 0.82,
    impact: 'HIGH',
    affectedSymbols: ['SPY', 'QQQ', 'AAPL'],
    category: 'ECONOMY',
  },
  {
    id: '2',
    title: 'NVIDIA reports record Q4 revenue, AI chip demand soars',
    summary: 'Data center revenue jumps 141% YoY, beating analyst estimates by $2B.',
    url: '#',
    source: 'Bloomberg',
    publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    sentiment: 'BULLISH',
    sentimentScore: 0.91,
    impact: 'HIGH',
    affectedSymbols: ['NVDA', 'AMD', 'TSM'],
    category: 'STOCKS',
  },
  {
    id: '3',
    title: 'Bitcoin breaks $80K barrier amid ETF inflows',
    summary: 'Spot Bitcoin ETFs saw $1.2B in net inflows last week, pushing BTC to new all-time highs.',
    url: '#',
    source: 'CoinDesk',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sentiment: 'BULLISH',
    sentimentScore: 0.75,
    impact: 'MEDIUM',
    affectedSymbols: ['BTC/USDT', 'ETH/USDT'],
    category: 'CRYPTO',
  },
  {
    id: '4',
    title: 'Tesla shares drop 6% on disappointing delivery numbers',
    summary: 'Q4 deliveries missed estimates as competition in EV space intensifies.',
    url: '#',
    source: 'CNBC',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    sentiment: 'BEARISH',
    sentimentScore: -0.68,
    impact: 'HIGH',
    affectedSymbols: ['TSLA'],
    category: 'STOCKS',
  },
  {
    id: '5',
    title: 'Oil prices stabilize as OPEC+ holds production steady',
    summary: 'Brent crude trades in narrow range as geopolitical tensions ease.',
    url: '#',
    source: 'WSJ',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    sentiment: 'NEUTRAL',
    sentimentScore: 0.05,
    impact: 'MEDIUM',
    affectedSymbols: ['USO', 'XLE'],
    category: 'ECONOMY',
  },
  {
    id: '6',
    title: 'Ethereum Shanghai upgrade boosts staking activity 40%',
    summary: 'Validators flock to network as withdrawals stabilize, ETH up 5% on the week.',
    url: '#',
    source: 'The Block',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    sentiment: 'BULLISH',
    sentimentScore: 0.62,
    impact: 'MEDIUM',
    affectedSymbols: ['ETH/USDT'],
    category: 'CRYPTO',
  },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const sentimentConfig = {
  BULLISH: { icon: TrendingUp, color: GREEN, bgColor: 'rgba(34,197,94,0.15)', border: `1px solid rgba(34,197,94,0.3)`, label: 'Bullish' },
  BEARISH: { icon: TrendingDown, color: RED, bgColor: 'rgba(239,68,68,0.15)', border: `1px solid rgba(239,68,68,0.3)`, label: 'Bearish' },
  NEUTRAL: { icon: Minus, color: TEXT2, bgColor: `rgba(156,163,175,0.15)`, border: `1px solid rgba(156,163,175,0.3)`, label: 'Neutral' },
};

function NewsCard({ article }: { article: NewsArticle }) {
  const sentiment = article.sentiment ? sentimentConfig[article.sentiment] : null;
  const SentimentIcon = sentiment?.icon;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ backgroundColor: CARD, borderColor: BORDER }}
      className="group block rounded-2xl border p-4 transition-all duration-150 cursor-pointer"
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = CARD; }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap gap-y-1">
          {sentiment && SentimentIcon && (
            <span
              style={{
                backgroundColor: sentiment.bgColor,
                color: sentiment.color,
                border: sentiment.border,
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold"
            >
              <SentimentIcon size={11} />
              {sentiment.label}
            </span>
          )}
          {article.impact === 'HIGH' && (
            <span
              style={{
                backgroundColor: 'rgba(239,68,68,0.15)',
                color: RED,
                border: `1px solid rgba(239,68,68,0.3)`,
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold"
            >
              <Flame size={11} />
              High Impact
            </span>
          )}
        </div>
        <ExternalLink size={14} style={{ color: TEXT2 }} className="group-hover:opacity-100 opacity-50 flex-shrink-0 mt-1 transition-opacity" />
      </div>

      <h3
        style={{
          color: article.sentiment === 'BULLISH' ? GREEN : article.sentiment === 'BEARISH' ? RED : TEXT1,
        }}
        className="text-sm font-bold mb-2 leading-snug transition-colors"
      >
        {article.title}
      </h3>

      {article.summary && (
        <p style={{ color: TEXT2 }} className="text-xs mb-3 leading-relaxed line-clamp-2">
          {article.summary}
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs">
          <span
            style={{
              color: article.sentiment === 'BULLISH' ? GREEN : article.sentiment === 'BEARISH' ? RED : TEXT1,
            }}
            className="font-bold"
          >
            {article.source}
          </span>
          <span style={{ color: TEXT3 }} className="flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(article.publishedAt)}
          </span>
        </div>
        {article.affectedSymbols && article.affectedSymbols.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {article.affectedSymbols.slice(0, 3).map(sym => (
              <span
                key={sym}
                style={{
                  backgroundColor: article.sentiment === 'BULLISH' ? 'rgba(34,197,94,0.15)' : article.sentiment === 'BEARISH' ? 'rgba(239,68,68,0.15)' : 'rgba(156,163,175,0.15)',
                  color: article.sentiment === 'BULLISH' ? GREEN : article.sentiment === 'BEARISH' ? RED : TEXT2,
                  border: article.sentiment === 'BULLISH' ? '1px solid rgba(34,197,94,0.3)' : article.sentiment === 'BEARISH' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(156,163,175,0.3)',
                }}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
              >
                {sym}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

export default function NewsPage() {
  const [category, setCategory] = useState('');
  const [sentiment, setSentiment] = useState('');
  const articles = MOCK_NEWS;

  const filtered = articles.filter(a => {
    if (category && a.category !== category) return false;
    if (sentiment && a.sentiment !== sentiment) return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ backgroundColor: BLUE }} className="p-2.5 rounded-xl">
              <Newspaper size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">News Feed</h1>
              <p style={{ color: TEXT2 }} className="text-sm">AI-powered sentiment analysis · Updates every minute</p>
            </div>
          </div>
        </div>

        {/* ── Filters ─────────────────────────── */}
        <div style={{ borderColor: BORDER }} className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b">
          <div className="flex items-center gap-3">
            <span style={{ color: TEXT3 }} className="text-xs uppercase tracking-wider font-bold">Category</span>
            <div className="flex gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  style={category === c.value
                    ? { backgroundColor: BLUE, color: '#fff' }
                    : { backgroundColor: ELEVATED, color: TEXT2, borderColor: BORDER }
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span style={{ color: TEXT3 }} className="text-xs uppercase tracking-wider font-bold">Sentiment</span>
            <div className="flex gap-2">
              {SENTIMENTS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setSentiment(s.value)}
                  style={sentiment === s.value
                    ? { backgroundColor: BLUE, color: '#fff' }
                    : { backgroundColor: ELEVATED, color: TEXT2, borderColor: BORDER }
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── News Feed ────────────────────────── */}
        {filtered.length === 0 ? (
          <div style={{ color: TEXT2 }} className="text-center py-16">
            <Newspaper size={40} style={{ color: TEXT3 }} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No articles match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
