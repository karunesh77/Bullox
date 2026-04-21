import prisma from '../../config/prisma';
import { CreateAlertInput } from './alerts.validation';
import { getQuote } from '../market/market.service';
import { logger } from '../../utils/logger';

const FREE_ALERT_LIMIT = 10;

// ── Create Alert ──────────────────────────────────────────
export const createAlert = async (userId: string, input: CreateAlertInput) => {
  // Check free tier limit
  const existingCount = await prisma.alert.count({
    where: { userId, triggered: false },
  });

  // Get user role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const isPro = user?.role === 'PRO' || user?.role === 'ADMIN';

  if (!isPro && existingCount >= FREE_ALERT_LIMIT) {
    throw new Error(`Free tier allows max ${FREE_ALERT_LIMIT} active alerts. Upgrade to Pro for unlimited.`);
  }

  // Validate symbol exists by fetching quote
  try {
    await getQuote(input.symbol);
  } catch {
    throw new Error(`Invalid symbol: ${input.symbol}`);
  }

  return prisma.alert.create({
    data: {
      userId,
      symbol: input.symbol,
      condition: input.condition,
      targetPrice: input.targetPrice,
    },
  });
};

// ── Get User Alerts ───────────────────────────────────────
export const getUserAlerts = async (userId: string) => {
  return prisma.alert.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

// ── Get Alert History (triggered) ────────────────────────
export const getAlertHistory = async (userId: string) => {
  return prisma.alert.findMany({
    where: { userId, triggered: true },
    orderBy: { triggeredAt: 'desc' },
    take: 50,
  });
};

// ── Update Alert ──────────────────────────────────────────
export const updateAlert = async (alertId: string, userId: string, data: Partial<CreateAlertInput>) => {
  const alert = await prisma.alert.findFirst({ where: { id: alertId, userId } });
  if (!alert) throw new Error('Alert not found');
  if (alert.triggered) throw new Error('Cannot update a triggered alert');

  return prisma.alert.update({
    where: { id: alertId },
    data: {
      ...(data.targetPrice && { targetPrice: data.targetPrice }),
      ...(data.condition && { condition: data.condition }),
    },
  });
};

// ── Delete Alert ──────────────────────────────────────────
export const deleteAlert = async (alertId: string, userId: string) => {
  const alert = await prisma.alert.findFirst({ where: { id: alertId, userId } });
  if (!alert) throw new Error('Alert not found');

  return prisma.alert.delete({ where: { id: alertId } });
};

// ── Check & Trigger Alerts (called by background job) ────
export const checkAndTriggerAlerts = async (): Promise<number> => {
  // Get all active (non-triggered) alerts
  const activeAlerts = await prisma.alert.findMany({
    where: { triggered: false },
  });

  if (activeAlerts.length === 0) return 0;

  // Group by symbol to avoid duplicate API calls
  const symbolMap: Record<string, typeof activeAlerts> = {};
  for (const alert of activeAlerts) {
    if (!symbolMap[alert.symbol]) symbolMap[alert.symbol] = [];
    symbolMap[alert.symbol].push(alert);
  }

  let triggered = 0;

  for (const [symbol, alerts] of Object.entries(symbolMap)) {
    try {
      const quote = await getQuote(symbol);
      const currentPrice = quote.price;

      for (const alert of alerts) {
        let shouldTrigger = false;

        if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.condition === 'percent_change') {
          const change = Math.abs(quote.changePercent);
          if (change >= alert.targetPrice) shouldTrigger = true;
        }

        if (shouldTrigger) {
          await prisma.alert.update({
            where: { id: alert.id },
            data: { triggered: true, triggeredAt: new Date() },
          });
          triggered++;
          logger.info(`🔔 Alert triggered: ${symbol} ${alert.condition} ${alert.targetPrice} (current: ${currentPrice})`);
        }
      }
    } catch (error: any) {
      logger.warn(`Alert check failed for ${symbol}: ${error.message}`);
    }
  }

  return triggered;
};
