import { Response, NextFunction } from 'express';
import { verifyAccessToken } from './auth.service';
import { AuthRequest } from '../../types';
import { sendError } from '../../utils/response';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      email: payload.email,
      username: '',
      role: payload.role,
    };

    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'ADMIN') {
    sendError(res, 'Access denied — Admins only', 403);
    return;
  }
  next();
};

export const authorizePro = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'PRO' && req.user?.role !== 'ADMIN') {
    sendError(res, 'Upgrade to Pro to access this feature', 403);
    return;
  }
  next();
};
