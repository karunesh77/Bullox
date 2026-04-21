import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import {
  becomeTraderHandler,
  updateTraderProfileHandler,
  getMyTraderProfileHandler,
  listPublicTradersHandler,
  getTraderByIdHandler,
  startCopyingHandler,
  stopCopyingHandler,
  getMyCopyTradesHandler,
} from './copytrading.controller';

const router = Router();

// ── Public routes ─────────────────────────────────────────
router.get('/traders', listPublicTradersHandler);                             // GET  /api/v1/copytrading/traders
router.get('/traders/:traderId', getTraderByIdHandler);                      // GET  /api/v1/copytrading/traders/:traderId

// ── Protected routes ──────────────────────────────────────
router.post('/become-trader', authenticate as any, becomeTraderHandler as any);               // POST  /api/v1/copytrading/become-trader
router.get('/my-trader-profile', authenticate as any, getMyTraderProfileHandler as any);      // GET   /api/v1/copytrading/my-trader-profile
router.patch('/my-trader-profile', authenticate as any, updateTraderProfileHandler as any);   // PATCH /api/v1/copytrading/my-trader-profile
router.post('/copy', authenticate as any, startCopyingHandler as any);                        // POST  /api/v1/copytrading/copy
router.patch('/copy/:copyTradeId/stop', authenticate as any, stopCopyingHandler as any);      // PATCH /api/v1/copytrading/copy/:copyTradeId/stop
router.get('/my-copies', authenticate as any, getMyCopyTradesHandler as any);                 // GET   /api/v1/copytrading/my-copies

export default router;
