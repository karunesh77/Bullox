import Parser from 'rss-parser';
import { logger } from '../../utils/logger';

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Bullox-NewsBot/1.0' },
});

// Top financial RSS feeds — all free
export const RSS_FEEDS = [
  {
    name: 'Reuters Business',
    url: 'https://feeds.reuters.com/reuters/businessNews',
    category: 'general',
  },
  {
    name: 'CNBC Markets',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069',
    category: 'stocks',
  },
  {
    name: 'Bloomberg Markets',
    url: 'https://feeds.bloomberg.com/markets/news.rss',
    category: 'general',
  },
  {
    name: 'Investing.com Crypto',
    url: 'https://www.investing.com/rss/news_301.rss',
    category: 'crypto',
  },
  {
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'crypto',
  },
  {
    name: 'FX Street Forex',
    url: 'https://www.fxstreet.com/rss/news',
    category: 'forex',
  },
];

export interface RawNewsItem {
  title: string;
  body: string;
  url: string;
  imageUrl?: string;
  source: string;
  category: string;
  publishedAt: Date;
}

export const fetchRSSFeed = async (
  feedUrl: string,
  source: string,
  category: string
): Promise<RawNewsItem[]> => {
  try {
    const feed = await parser.parseURL(feedUrl);

    return (feed.items || []).slice(0, 15).map((item) => ({
      title: item.title || '',
      body: item.contentSnippet || item.content || item.summary || '',
      url: item.link || item.guid || '',
      imageUrl: item.enclosure?.url,
      source,
      category,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    }));
  } catch (error: any) {
    logger.warn(`RSS fetch failed [${source}]: ${error.message}`);
    return [];
  }
};

export const fetchAllRSSFeeds = async (): Promise<RawNewsItem[]> => {
  const results = await Promise.allSettled(
    RSS_FEEDS.map((feed) => fetchRSSFeed(feed.url, feed.name, feed.category))
  );

  const allItems: RawNewsItem[] = [];
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  });

  // Sort by latest first
  return allItems.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
};
