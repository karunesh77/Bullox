import Redis from 'ioredis';
import { ENV } from './env';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;

export const connectRedis = (): Redis | null => {
  if (!ENV.REDIS_URL || ENV.REDIS_URL.includes('PASSWORD')) {
    logger.warn('⚠️  Redis URL not set — skipping connection');
    return null;
  }

  redisClient = new Redis(ENV.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  redisClient.on('connect', () => logger.info('✅ Redis connected'));
  redisClient.on('error', (err) => logger.error(`❌ Redis error: ${err.message}`));

  return redisClient;
};

export const getRedis = (): Redis | null => redisClient;
