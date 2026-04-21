import { createServer } from 'http';
import app from './app';
import { ENV } from './config/env';
import { logger } from './utils/logger';
import { connectMongoDB } from './config/db';
import { connectRedis } from './config/redis';
import { connectPrisma } from './config/prisma';
import { initQueues } from './jobs/queues';
import { startAlertsWorker } from './jobs/workers/alerts.worker';
import { startNewsWorker } from './jobs/workers/news.worker';
import { scheduleJobs } from './jobs/scheduler';
import { initSocketIO } from './socket/socket.manager';

const httpServer = createServer(app);

const startServer = async () => {
  // Connect databases
  await connectPrisma();
  await connectMongoDB();
  connectRedis();

  // Real-time socket
  initSocketIO(httpServer);

  // Background jobs
  initQueues();
  startAlertsWorker();
  startNewsWorker();
  await scheduleJobs();

  httpServer.listen(ENV.PORT, () => {
    logger.info(`🚀 Bullox API running on http://localhost:${ENV.PORT}`);
    logger.info(`📌 Environment: ${ENV.NODE_ENV}`);
  });
};

startServer();

export default httpServer;
