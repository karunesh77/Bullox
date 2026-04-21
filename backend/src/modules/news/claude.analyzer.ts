import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';

const client = new Anthropic({ apiKey: ENV.CLAUDE_API_KEY });

export interface NewsAnalysis {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'low' | 'medium' | 'high';
  summary: string;
  keywords: string[];
  symbols: string[];
}

// ── Analyze Single News Article ───────────────────────────
export const analyzeNewsArticle = async (
  title: string,
  body: string
): Promise<NewsAnalysis> => {
  // Default fallback if no API key
  if (!ENV.CLAUDE_API_KEY) {
    return {
      sentiment: 'neutral',
      impact: 'low',
      summary: body.slice(0, 150) + '...',
      keywords: [],
      symbols: [],
    };
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Analyze this financial news and respond ONLY with valid JSON, no extra text.

Title: ${title}
Body: ${body.slice(0, 500)}

Respond with this exact JSON format:
{
  "sentiment": "bullish" | "bearish" | "neutral",
  "impact": "low" | "medium" | "high",
  "summary": "One sentence summary under 100 chars",
  "keywords": ["keyword1", "keyword2"],
  "symbols": ["AAPL", "TSLA"]
}`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(text);
    return parsed as NewsAnalysis;
  } catch (error: any) {
    logger.warn(`Claude analysis failed: ${error.message}`);
    return {
      sentiment: 'neutral',
      impact: 'low',
      summary: title,
      keywords: [],
      symbols: [],
    };
  }
};

// ── Batch Analyze (to save API calls) ────────────────────
export const batchAnalyzeNews = async (
  articles: { title: string; body: string }[]
): Promise<NewsAnalysis[]> => {
  // Process max 5 at a time to avoid rate limits
  const results: NewsAnalysis[] = [];

  for (const article of articles.slice(0, 5)) {
    const analysis = await analyzeNewsArticle(article.title, article.body);
    results.push(analysis);
  }

  return results;
};
