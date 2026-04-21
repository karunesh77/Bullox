import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import {
  getLatestNews,
  getNewsById,
  getNewsBySymbol,
  getTrendingNews,
  syncNews,
} from './news.service';

export const latestNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;

    const data = await getLatestNews(page, limit, category);
    sendSuccess(res, data, 'News fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const newsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await getNewsById(req.params.id as string);
    if (!news) {
      sendError(res, 'News article not found', 404);
      return;
    }
    sendSuccess(res, news, 'News article fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const newsBySymbol = async (req: Request, res: Response): Promise<void> => {
  try {
    const symbol = (req.params.symbol as string).toUpperCase();
    const data = await getNewsBySymbol(symbol);
    sendSuccess(res, data, `News for ${symbol}`);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const trendingNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getTrendingNews();
    sendSuccess(res, data, 'Trending news fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Manual sync trigger (admin/testing use)
export const triggerSync = async (req: Request, res: Response): Promise<void> => {
  try {
    const saved = await syncNews();
    sendSuccess(res, { saved }, `Sync complete — ${saved} articles saved`);
  } catch (error: any) {
    sendError(res, error.message);
  }
};
