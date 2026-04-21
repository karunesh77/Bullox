import { NewsModel } from './news.model';
import { fetchAllRSSFeeds, RawNewsItem } from './rss.fetcher';
import { fetchFinnhubMarketNews, fetchFinnhubCompanyNews } from './finnhub.news';
import { analyzeNewsArticle } from './claude.analyzer';
import { getRedis } from '../../config/redis';
import { logger } from '../../utils/logger';

// ── Cache Helper ──────────────────────────────────────────
const getFromCache = async (key: string) => {
  const redis = getRedis();
  if (!redis) return null;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key: string, data: any, ttlSeconds: number) => {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
};

// ── Save Raw News to MongoDB ──────────────────────────────
const saveNewsItem = async (item: RawNewsItem) => {
  try {
    const exists = await NewsModel.findOne({ url: item.url });
    if (exists) return null;

    // Analyze with Claude
    const analysis = await analyzeNewsArticle(item.title, item.body);

    const news = new NewsModel({
      title: item.title,
      body: item.body,
      summary: analysis.summary,
      source: item.source,
      url: item.url,
      imageUrl: item.imageUrl,
      publishedAt: item.publishedAt,
      symbols: analysis.symbols,
      category: item.category,
      aiMeta: {
        sentiment: analysis.sentiment,
        impact: analysis.impact,
        summary: analysis.summary,
        keywords: analysis.keywords,
      },
    });

    await news.save();
    return news;
  } catch (error: any) {
    // Duplicate URL — skip silently
    if (error.code === 11000) return null;
    logger.warn(`Failed to save news: ${error.message}`);
    return null;
  }
};

// ── Sync News (called by scheduler or manually) ───────────
export const syncNews = async () => {
  logger.info('🔄 Syncing news...');

  const [rssItems, finnhubItems] = await Promise.all([
    fetchAllRSSFeeds(),
    fetchFinnhubMarketNews('general'),
  ]);

  const allItems = [...rssItems, ...finnhubItems].slice(0, 30);

  let saved = 0;
  for (const item of allItems) {
    const result = await saveNewsItem(item);
    if (result) saved++;
  }

  logger.info(`✅ News sync complete — ${saved} new articles saved`);
  return saved;
};

// ── Get Latest News ───────────────────────────────────────
export const getLatestNews = async (page = 1, limit = 20, category?: string) => {
  const cacheKey = `news:latest:${category || 'all'}:${page}`;

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const query: any = {};
  if (category && category !== 'all') query.category = category;

  const [news, total] = await Promise.all([
    NewsModel.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    NewsModel.countDocuments(query),
  ]);

  const result = { news, total, page, totalPages: Math.ceil(total / limit) };

  // Cache for 2 minutes
  await setCache(cacheKey, result, 120);

  return result;
};

// ── Get News by ID ────────────────────────────────────────
export const getNewsById = async (id: string) => {
  return NewsModel.findById(id).lean();
};

// ── Get News by Symbol ────────────────────────────────────
export const getNewsBySymbol = async (symbol: string) => {
  const cacheKey = `news:symbol:${symbol.toUpperCase()}`;

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  // Try MongoDB first
  const dbNews = await NewsModel.find({ symbols: symbol.toUpperCase() })
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();

  if (dbNews.length > 0) {
    await setCache(cacheKey, dbNews, 120);
    return dbNews;
  }

  // Fallback: Finnhub company news
  const items = await fetchFinnhubCompanyNews(symbol);
  await setCache(cacheKey, items, 120);
  return items;
};

// ── Get Trending News ─────────────────────────────────────
export const getTrendingNews = async () => {
  const cacheKey = 'news:trending';

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  const news = await NewsModel.find({ 'aiMeta.impact': { $in: ['medium', 'high'] } })
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();

  await setCache(cacheKey, news, 300);
  return news;
};
