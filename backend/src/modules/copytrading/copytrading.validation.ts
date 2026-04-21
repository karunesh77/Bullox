import { z } from 'zod';

export const becomeTraderSchema = z.object({
  bio: z.string().max(300, 'Bio max 300 characters').optional(),
  isPublic: z.boolean().optional(),
});

export const updateTraderProfileSchema = z.object({
  bio: z.string().max(300).optional(),
  isPublic: z.boolean().optional(),
});

export const startCopyingSchema = z.object({
  traderId: z.string().min(1, 'Trader ID is required'),
  allocatedAmount: z
    .number({ invalid_type_error: 'Allocated amount must be a number' })
    .positive('Allocated amount must be positive')
    .max(10_000_000, 'Allocated amount too large'),
});

export type BecomeTraderInput = z.infer<typeof becomeTraderSchema>;
export type UpdateTraderProfileInput = z.infer<typeof updateTraderProfileSchema>;
export type StartCopyingInput = z.infer<typeof startCopyingSchema>;
