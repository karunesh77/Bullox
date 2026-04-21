import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma';
import { UpdateProfileInput, ChangePasswordInput } from './user.validation';

// ── Get Profile ───────────────────────────────────────────
export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      role: true,
      isVerified: true,
      createdAt: true,
      subscription: {
        select: { planId: true, status: true, currentPeriodEnd: true },
      },
      _count: {
        select: { watchlists: true, alerts: true },
      },
    },
  });

  if (!user) throw new Error('User not found');
  return user;
};

// ── Update Profile ────────────────────────────────────────
export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
  if (input.username) {
    const taken = await prisma.user.findFirst({
      where: { username: input.username, id: { not: userId } },
    });
    if (taken) throw new Error('Username is already taken');
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.username && { username: input.username }),
      ...(input.avatarUrl && { avatarUrl: input.avatarUrl }),
    },
    select: {
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      role: true,
      updatedAt: true,
    },
  });
};

// ── Change Password ───────────────────────────────────────
export const changePassword = async (userId: string, input: ChangePasswordInput) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true, provider: true },
  });

  if (!user) throw new Error('User not found');

  if (user.provider && !user.passwordHash) {
    throw new Error('OAuth accounts cannot change password here');
  }

  const isMatch = await bcrypt.compare(input.currentPassword, user.passwordHash!);
  if (!isMatch) throw new Error('Current password is incorrect');

  const hashed = await bcrypt.hash(input.newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashed },
  });
};

// ── Get Public Profile (by username) ─────────────────────
export const getPublicProfile = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      trader: {
        select: { bio: true, winRate: true, totalReturn: true, isPublic: true },
      },
    },
  });

  if (!user) throw new Error('User not found');
  return user;
};
