import { alertsQueue, newsQueue } from './queues';
import { logger } from '../utils/logger';

export const scheduleJobs = async () => {
  if (!alertsQueue || !newsQueue) {
    logger.warn('⚠️  Scheduler skipped — queues not initialized');
    return;
  }

  // Remove old repeatable jobs before re-adding (prevents duplicates on restart)
  const alertRepeatables = await alertsQueue.getRepeatableJobs();
  for (const job of alertRepeatables) {
    await alertsQueue.removeRepeatableByKey(job.key);
  }

  const newsRepeatables = await newsQueue.getRepeatableJobs();
  for (const job of newsRepeatables) {
    await newsQueue.removeRepeatableByKey(job.key);
  }

  // Check & trigger price alerts every 1 minute
  await alertsQueue.add(
    'check-alerts',
    {},
    {
      repeat: { every: 60 * 1000 },
      removeOnComplete: 50,
      removeOnFail: 20,
    }
  );

  // Sync news from RSS + Finnhub every 15 minutes
  await newsQueue.add(
    'sync-news',
    {},
    {
      repeat: { every: 15 * 60 * 1000 },
      removeOnComplete: 10,
      removeOnFail: 10,
    }
  );

  logger.info('⏰ Scheduled: alerts every 1min, news sync every 15min');
};
