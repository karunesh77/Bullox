import axios from 'axios';
import { ENV } from '../../config/env';
import { RawNewsItem } from './rss.fetcher';
import { logger } from '../../utils/logger';

const finnhub = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: { token: ENV.FINNHUB_API_KEY },
  timeout: 8000,
});

// ── General Market News ───────────────────────────────────
export const fetchFinnhubMarketNews = async (category = 'general'): Promise<RawNewsItem[]> => {
  try {
    if (!ENV.FINNHUB_API_KEY) return [];

    const { data } = await finnhub.get('/news', { params: { category } });

    return (data || []).slice(0, 20).map((item: any) => ({
      title: item.headline,
      body: item.summary || '',
      url: item.url,
      imageUrl: item.image,
      source: item.source || 'Finnhub',
      category,
      publishedAt: new Date(item.datetime * 1000),
    }));
  } catch (error: any) {
    logger.warn(`Finnhub market news failed: ${error.message}`);
    return [];
  }
};

// ── Company Specific News ─────────────────────────────────
export const fetchFinnhubCompanyNews = async (symbol: string): Promise<RawNewsItem[]> => {
  try {
    if (!ENV.FINNHUB_API_KEY) return [];

    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data } = await finnhub.get('/company-news', {
      params: { symbol, from, to },
    });

    return (data || []).slice(0, 10).map((item: any) => ({
      title: item.headline,
      body: item.summary || '',
      url: item.url,
      imageUrl: item.image,
      source: item.source || 'Finnhub',
      category: 'stocks',
      publishedAt: new Date(item.datetime * 1000),
    }));
  } catch (error: any) {
    logger.warn(`Finnhub company news failed [${symbol}]: ${error.message}`);
    return [];
  }
};
