import { Worker, Job } from 'bullmq';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';
import { syncNews } from '../../modules/news/news.service';

const connection = ENV.REDIS_URL && !ENV.REDIS_URL.includes('PASSWORD')
  ? { url: ENV.REDIS_URL }
  : null;

export const startNewsWorker = () => {
  if (!connection) return null;

  const worker = new Worker(
    'news',
    async (job: Job) => {
      if (job.name === 'sync-news') {
        logger.info('📰 News sync job started...');
        await syncNews();
        logger.info('📰 News sync job completed');
      }
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    logger.error(`❌ News job failed [${job?.id}]: ${err.message}`);
  });

  logger.info('✅ News worker started');
  return worker;
};
