import { Worker, Job } from 'bullmq';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';
import { checkAndTriggerAlerts } from '../../modules/alerts/alerts.service';

const connection = ENV.REDIS_URL && !ENV.REDIS_URL.includes('PASSWORD')
  ? { url: ENV.REDIS_URL }
  : null;

export const startAlertsWorker = () => {
  if (!connection) return null;

  const worker = new Worker(
    'alerts',
    async (job: Job) => {
      if (job.name === 'check-alerts') {
        const triggered = await checkAndTriggerAlerts();
        if (triggered > 0) {
          logger.info(`🔔 Alerts job: ${triggered} alert(s) triggered`);
        }
      }
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    logger.error(`❌ Alerts job failed [${job?.id}]: ${err.message}`);
  });

  logger.info('✅ Alerts worker started');
  return worker;
};
