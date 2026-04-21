import { Request, Response } from 'express';
import { registerSchema, loginSchema, refreshSchema } from './auth.validation';
import { registerUser, loginUser, refreshTokens, getUserById } from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors[0].message, 400);
      return;
    }
    const result = await registerUser(parsed.data);
    sendSuccess(res, result, 'Registration successful', 201);
  } catch (error: any) {
    sendError(res, error.message, 400);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors[0].message, 400);
      return;
    }
    const result = await loginUser(parsed.data);
    sendSuccess(res, result, 'Login successful');
  } catch (error: any) {
    sendError(res, error.message, 401);
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.errors[0].message, 400);
      return;
    }
    const tokens = await refreshTokens(parsed.data.refreshToken);
    sendSuccess(res, tokens, 'Tokens refreshed');
  } catch (error: any) {
    sendError(res, 'Invalid or expired refresh token', 401);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // In future: blacklist refresh token in Redis
  sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await getUserById(req.user!.id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, user, 'User fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};
