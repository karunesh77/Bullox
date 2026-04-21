import { Request, Response } from 'express';
import { AuthRequest } from '../../types';
import { sendSuccess, sendError } from '../../utils/response';
import { updateProfileSchema, changePasswordSchema } from './user.validation';
import { getProfile, updateProfile, changePassword, getPublicProfile } from './user.service';

export const getProfileHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await getProfile(req.user!.id);
    sendSuccess(res, profile, 'Profile fetched');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateProfileHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }
    if (!parsed.data.username && !parsed.data.avatarUrl) {
      sendError(res, 'Provide at least one field to update', 400);
      return;
    }
    const profile = await updateProfile(req.user!.id, parsed.data);
    sendSuccess(res, profile, 'Profile updated');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const changePasswordHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, parsed.error.errors[0].message, 400); return; }
    await changePassword(req.user!.id, parsed.data);
    sendSuccess(res, null, 'Password changed successfully');
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getPublicProfileHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await getPublicProfile(req.params.username as string);
    sendSuccess(res, profile, 'Public profile fetched');
  } catch (error: any) {
    sendError(res, error.message, 404);
  }
};
