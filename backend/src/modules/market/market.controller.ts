import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import {
  getQuote,
  getBulkQuotes,
  getCandles,
  searchSymbols,
  getTopCryptoList,
  getMovers,
} from './market.service';
import { CandleInterval } from '../../types/market';

export const quote = async (req: Request, res: Response): Promise<void> => {
  try {
    const symbol = String(req.params.symbol);
    const data = await getQuote(symbol.toUpperCase());
    sendSuccess(res, data, 'Quote fetched');
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};

export const bulkQuotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const symbols = (req.query.symbols as string)?.split(',').map((s) => s.trim());
    if (!symbols || symbols.length === 0) {
      sendError(res, 'Provide symbols as ?symbols=AAPL,TSLA', 400);
      return;
    }
    if (symbols.length > 50) {
      sendError(res, 'Max 50 symbols allowed', 400);
      return;
    }
    const data = await getBulkQuotes(symbols);
    sendSuccess(res, data, 'Bulk quotes fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const candles = async (req: Request, res: Response): Promise<void> => {
  try {
    const symbol = String(req.params.symbol);
    const interval = (req.query.interval as CandleInterval) || 'D';
    const to = Math.floor(Date.now() / 1000);
    const from = parseInt(req.query.from as string) || to - 30 * 24 * 60 * 60; // default 30 days

    const data = await getCandles(symbol.toUpperCase(), interval, from, to);
    sendSuccess(res, data, 'Candles fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query || query.length < 1) {
      sendError(res, 'Provide search query as ?q=AAPL', 400);
      return;
    }
    const data = await searchSymbols(query);
    sendSuccess(res, data, 'Search results');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const topCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getTopCryptoList();
    sendSuccess(res, data, 'Top crypto fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const movers = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getMovers();
    const type = req.query.type as string;
    const sorted =
      type === 'losers'
        ? [...data].sort((a: any, b: any) => a.changePercent - b.changePercent)
        : data;
    sendSuccess(res, sorted, 'Market movers fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};
