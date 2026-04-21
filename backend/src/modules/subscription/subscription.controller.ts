import { Request, Response } from 'express';
import { AuthRequest } from '../../types';
import { sendSuccess, sendError } from '../../utils/response';
import { createOrderSchema, verifyPaymentSchema } from './subscription.validation';
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  getPlans,
} from './subscription.service';

export const getPlansHandler = async (req: Request, res: Response): Promise<void> => {
  const plans = getPlans();
  sendSuccess(res, plans, 'Plans fetched');
};

export const createOrderHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }

    const order = await createOrder(req.user!.id, parsed.data);
    sendSuccess(res, order, 'Order created');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const verifyPaymentHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = verifyPaymentSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }

    const result = await verifyPayment(req.user!.id, parsed.data);
    sendSuccess(res, result, 'Payment verified — account upgraded to Pro!');
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const getStatusHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const status = await getSubscriptionStatus(req.user!.id);
    sendSuccess(res, status, 'Subscription status fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};
