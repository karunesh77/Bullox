import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import {
  createAlertHandler,
  getUserAlertsHandler,
  getAlertHistoryHandler,
  updateAlertHandler,
  deleteAlertHandler,
} from './alerts.controller';

const router = Router();

router.use(authenticate as any);

router.post('/', createAlertHandler as any);          // POST   /api/v1/alerts
router.get('/', getUserAlertsHandler as any);         // GET    /api/v1/alerts
router.get('/history', getAlertHistoryHandler as any); // GET    /api/v1/alerts/history
router.patch('/:id', updateAlertHandler as any);      // PATCH  /api/v1/alerts/:id
router.delete('/:id', deleteAlertHandler as any);     // DELETE /api/v1/alerts/:id

export default router;
