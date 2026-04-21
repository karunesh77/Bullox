import { Router } from 'express';
import { latestNews, newsById, newsBySymbol, trendingNews, triggerSync } from './news.controller';

const router = Router();

router.get('/', latestNews);                    // GET /api/v1/news?page=1&limit=20&category=crypto
router.get('/trending', trendingNews);          // GET /api/v1/news/trending
router.get('/symbol/:symbol', newsBySymbol);    // GET /api/v1/news/symbol/AAPL
router.get('/:id', newsById);                   // GET /api/v1/news/:id
router.post('/sync', triggerSync);              // POST /api/v1/news/sync (manual trigger)

export default router;
