import { z } from 'zod';

export const createAlertSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').toUpperCase(),
  condition: z.enum(['above', 'below', 'percent_change'], {
    errorMap: () => ({ message: 'Condition must be above, below, or percent_change' }),
  }),
  targetPrice: z.number({ invalid_type_error: 'Target price must be a number' })
    .positive('Target price must be positive'),
});

export const updateAlertSchema = z.object({
  targetPrice: z.number().positive().optional(),
  condition: z.enum(['above', 'below', 'percent_change']).optional(),
});

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
