import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export const connectPrisma = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL (Prisma) connected');
  } catch (error) {
    logger.warn(`⚠️  PostgreSQL connection skipped — set DATABASE_URL in .env`);
  }
};

export default prisma;
