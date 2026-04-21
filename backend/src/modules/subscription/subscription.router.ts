import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import {
  getPlansHandler,
  createOrderHandler,
  verifyPaymentHandler,
  getStatusHandler,
} from './subscription.controller';

const router = Router();

// Public — no auth needed
router.get('/plans', getPlansHandler);                                        // GET  /api/v1/subscription/plans

// Protected
router.post('/order', authenticate as any, createOrderHandler as any);        // POST /api/v1/subscription/order
router.post('/verify', authenticate as any, verifyPaymentHandler as any);     // POST /api/v1/subscription/verify
router.get('/status', authenticate as any, getStatusHandler as any);          // GET  /api/v1/subscription/status

export default router;
