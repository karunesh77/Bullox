import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink, Clock, Flame } from 'lucide-react';
import api from '@/api/axios';
import { cn } from '@/lib/utils';

interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentimentScore?: number;
  impact?: 'HIGH' | 'MEDIUM' | 'LOW';
  affectedSymbols?: string[];
  category?: string;
}

const newsApi = {
  getFeed: (params?: { category?: string; sentiment?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.sentiment) qs.set('sentiment', params.sentiment);
    if (params?.limit) qs.set('limit', String(params.limit));
    return api.get(`/news?${qs.toString()}`);
  },
};

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

// Fallback mock data for when backend is not connected
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
    affectedSymbols: ['BTCUSDT', 'ETHUSDT'],
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
    affectedSymbols: ['ETHUSDT'],
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
  BULLISH: { icon: TrendingUp, color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300', label: 'Bullish' },
  BEARISH: { icon: TrendingDown, color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300', label: 'Bearish' },
  NEUTRAL: { icon: Minus, color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-300', label: 'Neutral' },
};

function NewsCard({ article }: { article: NewsArticle }) {
  const sentiment = article.sentiment ? sentimentConfig[article.sentiment] : null;
  const SentimentIcon = sentiment?.icon;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block rounded-2xl border p-5 hover:shadow-lg transition-all',
        article.sentiment === 'BULLISH' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300' :
        article.sentiment === 'BEARISH' ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200 hover:border-red-300' :
        'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {sentiment && SentimentIcon && (
            <span className={cn('flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border', sentiment.bg, sentiment.border, sentiment.color)}>
              <SentimentIcon size={12} />
              {sentiment.label}
            </span>
          )}
          {article.impact === 'HIGH' && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 border border-orange-300 text-orange-700">
              <Flame size={12} />
              High Impact
            </span>
          )}
        </div>
        <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-1" />
      </div>

      <h3 className={cn('text-base font-bold mb-2 leading-snug transition-colors',
        article.sentiment === 'BULLISH' ? 'text-green-900 group-hover:text-green-700' :
        article.sentiment === 'BEARISH' ? 'text-red-900 group-hover:text-red-700' :
        'text-blue-900 group-hover:text-blue-700'
      )}>
        {article.title}
      </h3>

      {article.summary && (
        <p className={cn('text-sm mb-3 leading-relaxed line-clamp-2',
          article.sentiment === 'BULLISH' ? 'text-green-800' :
          article.sentiment === 'BEARISH' ? 'text-red-800' :
          'text-blue-800'
        )}>
          {article.summary}
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs">
          <span className={cn('font-bold',
            article.sentiment === 'BULLISH' ? 'text-green-800' :
            article.sentiment === 'BEARISH' ? 'text-red-800' :
            'text-blue-800'
          )}>{article.source}</span>
          <span className={cn('flex items-center gap-1',
            article.sentiment === 'BULLISH' ? 'text-green-700' :
            article.sentiment === 'BEARISH' ? 'text-red-700' :
            'text-blue-700'
          )}>
            <Clock size={11} />
            {timeAgo(article.publishedAt)}
          </span>
        </div>
        {article.affectedSymbols && article.affectedSymbols.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {article.affectedSymbols.slice(0, 3).map((sym) => (
              <span key={sym} className={cn('text-xs font-bold px-3 py-1 rounded-lg border',
                article.sentiment === 'BULLISH' ? 'bg-green-200 text-green-800 border-green-400' :
                article.sentiment === 'BEARISH' ? 'bg-red-200 text-red-800 border-red-400' :
                'bg-blue-200 text-blue-800 border-blue-400'
              )}>
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

  const { data, isLoading } = useQuery({
    queryKey: ['news', category, sentiment],
    queryFn: async () => {
      try {
        const res = await newsApi.getFeed({ category, sentiment, limit: 30 });
        return (res.data?.articles || res.data || []) as NewsArticle[];
      } catch {
        return MOCK_NEWS;
      }
    },
    refetchInterval: 60000,
  });

  const articles = data || [];
  const filtered = articles.filter((a) => {
    if (category && a.category !== category) return false;
    if (sentiment && a.sentiment !== sentiment) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-purple-50 p-6">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100">
            <Newspaper size={24} className="text-blue-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">News Feed</h1>
            <p className="text-sm text-gray-600">AI-powered sentiment analysis · Updates every minute</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">Category</span>
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-bold transition-all',
                  category === c.value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">Sentiment</span>
          <div className="flex gap-2">
            {SENTIMENTS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSentiment(s.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-bold transition-all',
                  sentiment === s.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-200 border border-gray-300 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
          <p>No articles match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
