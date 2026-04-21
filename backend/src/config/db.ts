import mongoose from 'mongoose';
import { ENV } from './env';
import { logger } from '../utils/logger';

export const connectMongoDB = async (): Promise<void> => {
  try {
    if (!ENV.MONGODB_URI || ENV.MONGODB_URI.includes('USER:PASSWORD')) {
      logger.warn('⚠️  MongoDB URI not set — skipping connection');
      return;
    }
    await mongoose.connect(ENV.MONGODB_URI);
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error}`);
  }
};

export const disconnectMongoDB = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
