import prisma from '../../config/prisma';
import {
  BecomeTraderInput,
  UpdateTraderProfileInput,
  StartCopyingInput,
} from './copytrading.validation';

// ── Become a Trader ───────────────────────────────────────
export const becomeTrader = async (userId: string, input: BecomeTraderInput) => {
  const existing = await prisma.trader.findUnique({ where: { userId } });
  if (existing) throw new Error('You are already registered as a trader');

  return prisma.trader.create({
    data: {
      userId,
      bio: input.bio ?? null,
      isPublic: input.isPublic ?? false,
    },
  });
};

// ── Update Trader Profile ─────────────────────────────────
export const updateTraderProfile = async (userId: string, input: UpdateTraderProfileInput) => {
  const trader = await prisma.trader.findUnique({ where: { userId } });
  if (!trader) throw new Error('Trader profile not found');

  return prisma.trader.update({
    where: { userId },
    data: {
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
    },
  });
};

// ── Get My Trader Profile ─────────────────────────────────
export const getMyTraderProfile = async (userId: string) => {
  const trader = await prisma.trader.findUnique({
    where: { userId },
    include: {
      user: { select: { username: true, avatarUrl: true, email: true } },
    },
  });
  if (!trader) throw new Error('You have not registered as a trader yet');
  return trader;
};

// ── List Public Traders ───────────────────────────────────
export const listPublicTraders = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [traders, total] = await Promise.all([
    prisma.trader.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { username: true, avatarUrl: true } },
      },
      orderBy: { totalReturn: 'desc' },
      skip,
      take: limit,
    }),
    prisma.trader.count({ where: { isPublic: true } }),
  ]);

  return { traders, total, page, limit };
};

// ── Get Single Trader by traderId ─────────────────────────
export const getTraderById = async (traderId: string) => {
  const trader = await prisma.trader.findUnique({
    where: { id: traderId },
    include: {
      user: { select: { username: true, avatarUrl: true } },
    },
  });
  if (!trader || !trader.isPublic) throw new Error('Trader not found');
  return trader;
};

// ── Start Copying a Trader ────────────────────────────────
export const startCopying = async (userId: string, input: StartCopyingInput) => {
  // Cannot copy yourself
  const trader = await prisma.trader.findUnique({ where: { id: input.traderId } });
  if (!trader) throw new Error('Trader not found');
  if (trader.userId === userId) throw new Error('You cannot copy yourself');
  if (!trader.isPublic) throw new Error('This trader is not accepting followers');

  // Check if already copying
  const existing = await prisma.copyTrade.findFirst({
    where: { userId, traderId: input.traderId, isActive: true },
  });
  if (existing) throw new Error('You are already copying this trader');

  // PRO only feature
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const isPro = user?.role === 'PRO' || user?.role === 'ADMIN';
  if (!isPro) throw new Error('Copy trading is a Pro feature. Upgrade to Pro to use it.');

  // Increment followers count
  await prisma.trader.update({
    where: { id: input.traderId },
    data: { followers: { increment: 1 } },
  });

  return prisma.copyTrade.create({
    data: {
      userId,
      traderId: input.traderId,
      allocatedAmount: input.allocatedAmount,
    },
  });
};

// ── Stop Copying a Trader ─────────────────────────────────
export const stopCopying = async (userId: string, copyTradeId: string) => {
  const copyTrade = await prisma.copyTrade.findFirst({
    where: { id: copyTradeId, userId, isActive: true },
  });
  if (!copyTrade) throw new Error('Active copy trade not found');

  // Decrement followers count
  await prisma.trader.update({
    where: { id: copyTrade.traderId },
    data: { followers: { decrement: 1 } },
  });

  return prisma.copyTrade.update({
    where: { id: copyTradeId },
    data: { isActive: false },
  });
};

// ── Get My Copy Trades ────────────────────────────────────
export const getMyCopyTrades = async (userId: string) => {
  return prisma.copyTrade.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
