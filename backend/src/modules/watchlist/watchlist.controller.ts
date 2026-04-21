import { Response } from 'express';
import { AuthRequest } from '../../types';
import { sendSuccess, sendError } from '../../utils/response';
import { createWatchlistSchema, addSymbolSchema } from './watchlist.validation';
import {
  createWatchlist,
  getUserWatchlists,
  getWatchlistById,
  addSymbolToWatchlist,
  removeSymbolFromWatchlist,
  renameWatchlist,
  deleteWatchlist,
} from './watchlist.service';

export const createWatchlistHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = createWatchlistSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }

    const watchlist = await createWatchlist(req.user!.id, parsed.data);
    sendSuccess(res, watchlist, 'Watchlist created', 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getUserWatchlistsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const watchlists = await getUserWatchlists(req.user!.id);
    sendSuccess(res, watchlists, 'Watchlists fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getWatchlistByIdHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const watchlist = await getWatchlistById(req.params.id as string, req.user!.id);
    sendSuccess(res, watchlist, 'Watchlist fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const addSymbolHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = addSymbolSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }

    const watchlist = await addSymbolToWatchlist(req.params.id as string, req.user!.id, parsed.data.symbol);
    sendSuccess(res, watchlist, 'Symbol added');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const removeSymbolHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const symbol = (req.params.symbol as string).toUpperCase();
    const watchlist = await removeSymbolFromWatchlist(req.params.id as string, req.user!.id, symbol);
    sendSuccess(res, watchlist, 'Symbol removed');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const renameWatchlistHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = createWatchlistSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }

    const watchlist = await renameWatchlist(req.params.id as string, req.user!.id, parsed.data.name);
    sendSuccess(res, watchlist, 'Watchlist renamed');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const deleteWatchlistHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await deleteWatchlist(req.params.id as string, req.user!.id);
    sendSuccess(res, null, 'Watchlist deleted');
  } catch (error: any) {
    sendError(res, error.message);
  }
};
