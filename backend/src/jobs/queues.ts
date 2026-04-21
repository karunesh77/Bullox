import { Queue } from 'bullmq';
import { ENV } from '../config/env';
import { logger } from '../utils/logger';

const connection = ENV.REDIS_URL && !ENV.REDIS_URL.includes('PASSWORD')
  ? { url: ENV.REDIS_URL }
  : null;

export let alertsQueue: Queue | null = null;
export let newsQueue: Queue | null = null;

export const initQueues = () => {
  if (!connection) {
    logger.warn('⚠️  BullMQ queues skipped — Redis not configured');
    return;
  }

  alertsQueue = new Queue('alerts', { connection });
  newsQueue = new Queue('news', { connection });

  logger.info('✅ BullMQ queues initialized');
};
