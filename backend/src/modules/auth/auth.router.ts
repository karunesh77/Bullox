import { Router } from 'express';
import { register, login, refresh, logout, getMe } from './auth.controller';
import { authenticate } from './auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Strict rate limit for auth routes — 10 attempts per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, try again after 15 minutes' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', authenticate as any, logout as any);
router.get('/me', authenticate as any, getMe as any);

export default router;
