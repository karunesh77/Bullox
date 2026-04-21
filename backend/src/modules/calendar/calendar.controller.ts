import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import {
  getCalendarEvents,
  getTodayEvents,
  getHighImpactEvents,
  getSupportedCountries,
} from './calendar.service';
import { ImpactLevel } from '../../types/calendar';

export const calendarEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const from = (req.query.from as string) || today;
    const to = (req.query.to as string) || today;
    const country = req.query.country as string | undefined;
    const impact = req.query.impact as ImpactLevel | undefined;

    // Max 31 day range
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffDays = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 31) {
      sendError(res, 'Max date range is 31 days', 400);
      return;
    }

    const data = await getCalendarEvents(from, to, country, impact);
    sendSuccess(res, data, 'Calendar events fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const todayEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const country = req.query.country as string | undefined;
    const impact = req.query.impact as ImpactLevel | undefined;
    const data = await getCalendarEvents(today, today, country, impact);
    sendSuccess(res, data, "Today's events fetched");
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const highImpactEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const from = (req.query.from as string) || today;
    const to = (req.query.to as string) || nextWeek;

    const data = await getHighImpactEvents(from, to);
    sendSuccess(res, data, 'High impact events fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const supportedCountries = async (req: Request, res: Response): Promise<void> => {
  const data = getSupportedCountries();
  sendSuccess(res, data, 'Supported countries');
};
