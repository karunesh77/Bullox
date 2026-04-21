import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import {
  createWatchlistHandler,
  getUserWatchlistsHandler,
  getWatchlistByIdHandler,
  addSymbolHandler,
  removeSymbolHandler,
  renameWatchlistHandler,
  deleteWatchlistHandler,
} from './watchlist.controller';

const router = Router();

router.use(authenticate as any);

router.post('/', createWatchlistHandler as any);                        // POST   /api/v1/watchlists
router.get('/', getUserWatchlistsHandler as any);                       // GET    /api/v1/watchlists
router.get('/:id', getWatchlistByIdHandler as any);                     // GET    /api/v1/watchlists/:id
router.patch('/:id/rename', renameWatchlistHandler as any);             // PATCH  /api/v1/watchlists/:id/rename
router.delete('/:id', deleteWatchlistHandler as any);                   // DELETE /api/v1/watchlists/:id
router.post('/:id/symbols', addSymbolHandler as any);                   // POST   /api/v1/watchlists/:id/symbols
router.delete('/:id/symbols/:symbol', removeSymbolHandler as any);     // DELETE /api/v1/watchlists/:id/symbols/:symbol

export default router;
