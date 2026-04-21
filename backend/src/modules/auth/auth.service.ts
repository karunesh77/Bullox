import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { ENV } from '../../config/env';
import { RegisterInput, LoginInput } from './auth.validation';
import { TokenPair, JwtPayload } from '../../types';

// ── Token Helpers ─────────────────────────────────────────
const generateTokens = (payload: JwtPayload): TokenPair => {
  const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
  const refreshToken = jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN as any,
  });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as JwtPayload;
};

// ── Register ──────────────────────────────────────────────
export const registerUser = async (input: RegisterInput) => {
  const { email, username, password } = input;

  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) throw new Error('Email already registered');

  // Check if username already exists
  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) throw new Error('Username already taken');

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: { email, username, passwordHash },
    select: { id: true, email: true, username: true, role: true, isVerified: true },
  });

  // Generate tokens
  const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });

  return { user, tokens };
};

// ── Login ─────────────────────────────────────────────────
export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or password');
  if (!user.passwordHash) throw new Error('Please login with Google');

  // Verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Invalid email or password');

  // Generate tokens
  const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    isVerified: user.isVerified,
    avatarUrl: user.avatarUrl,
  };

  return { user: safeUser, tokens };
};

// ── Refresh Token ─────────────────────────────────────────
export const refreshTokens = async (token: string) => {
  const payload = verifyRefreshToken(token);

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new Error('User not found');

  const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });
  return tokens;
};

// ── Get User By ID ────────────────────────────────────────
export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, username: true, role: true, isVerified: true, avatarUrl: true, createdAt: true },
  });
};
