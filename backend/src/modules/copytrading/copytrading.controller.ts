import { Request, Response } from 'express';
import { AuthRequest } from '../../types';
import { sendSuccess, sendError } from '../../utils/response';
import {
  becomeTraderSchema,
  updateTraderProfileSchema,
  startCopyingSchema,
} from './copytrading.validation';
import {
  becomeTrader,
  updateTraderProfile,
  getMyTraderProfile,
  listPublicTraders,
  getTraderById,
  startCopying,
  stopCopying,
  getMyCopyTrades,
} from './copytrading.service';

export const becomeTraderHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = becomeTraderSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }
    const trader = await becomeTrader(req.user!.id, parsed.data);
    sendSuccess(res, trader, 'Trader profile created', 201);
  } catch (error: any) { sendError(res, error.message); }
};

export const updateTraderProfileHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = updateTraderProfileSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }
    const trader = await updateTraderProfile(req.user!.id, parsed.data);
    sendSuccess(res, trader, 'Trader profile updated');
  } catch (error: any) { sendError(res, error.message); }
};

export const getMyTraderProfileHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trader = await getMyTraderProfile(req.user!.id);
    sendSuccess(res, trader, 'Trader profile fetched');
  } catch (error: any) { sendError(res, error.message, 404); }
};

export const listPublicTradersHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const data = await listPublicTraders(page, limit);
    sendSuccess(res, data, 'Traders fetched');
  } catch (error: any) { sendError(res, error.message); }
};

export const getTraderByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const trader = await getTraderById(req.params.traderId as string);
    sendSuccess(res, trader, 'Trader fetched');
  } catch (error: any) { sendError(res, error.message, 404); }
};

export const startCopyingHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = startCopyingSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }
    const copyTrade = await startCopying(req.user!.id, parsed.data);
    sendSuccess(res, copyTrade, 'Now copying trader', 201);
  } catch (error: any) { sendError(res, error.message); }
};

export const stopCopyingHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await stopCopying(req.user!.id, req.params.copyTradeId as string);
    sendSuccess(res, result, 'Stopped copying trader');
  } catch (error: any) { sendError(res, error.message); }
};

export const getMyCopyTradesHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const trades = await getMyCopyTrades(req.user!.id);
    sendSuccess(res, trades, 'Copy trades fetched');
  } catch (error: any) { sendError(res, error.message); }
};
