import { Response } from 'express';
import { AuthRequest } from '../../types';
import { sendSuccess, sendError } from '../../utils/response';
import { createAlertSchema, updateAlertSchema } from './alerts.validation';
import {
  createAlert,
  getUserAlerts,
  getAlertHistory,
  updateAlert,
  deleteAlert,
} from './alerts.service';

export const createAlertHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = createAlertSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors[0].message, 400);
      return;
    }
    const alert = await createAlert(req.user!.id, parsed.data);
    sendSuccess(res, alert, 'Alert created', 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getUserAlertsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alerts = await getUserAlerts(req.user!.id);
    sendSuccess(res, alerts, 'Alerts fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getAlertHistoryHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const history = await getAlertHistory(req.user!.id);
    sendSuccess(res, history, 'Alert history fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateAlertHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = updateAlertSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors[0].message, 400);
      return;
    }
    const alert = await updateAlert(req.params.id as string, req.user!.id, parsed.data);
    sendSuccess(res, alert, 'Alert updated');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const deleteAlertHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await deleteAlert(req.params.id as string, req.user!.id);
    sendSuccess(res, null, 'Alert deleted');
  } catch (error: any) {
    sendError(res, error.message);
  }
};
