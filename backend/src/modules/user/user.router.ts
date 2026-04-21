import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import {
  getProfileHandler,
  updateProfileHandler,
  changePasswordHandler,
  getPublicProfileHandler,
} from './user.controller';

const router = Router();

// Public route - no auth needed
router.get('/profile/:username', getPublicProfileHandler);               // GET  /api/v1/users/profile/:username

// Protected routes
router.get('/me', authenticate as any, getProfileHandler as any);        // GET  /api/v1/users/me
router.patch('/me', authenticate as any, updateProfileHandler as any);   // PATCH /api/v1/users/me
router.post('/me/change-password', authenticate as any, changePasswordHandler as any); // POST /api/v1/users/me/change-password

export default router;
