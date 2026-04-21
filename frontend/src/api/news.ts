import api from './axios';

export interface NewsArticle {
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

export const newsApi = {
  getFeed: (params?: { category?: string; sentiment?: string; symbol?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.sentiment) qs.set('sentiment', params.sentiment);
    if (params?.symbol) qs.set('symbol', params.symbol);
    if (params?.limit) qs.set('limit', String(params.limit));
    return api.get(`/news?${qs.toString()}`);
  },
  getById: (id: string) => api.get(`/news/${id}`),
};
