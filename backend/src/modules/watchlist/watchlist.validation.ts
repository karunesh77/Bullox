import { z } from 'zod';

export const createWatchlistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name max 50 chars').trim(),
});

export const addSymbolSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').toUpperCase(),
});

export type CreateWatchlistInput = z.infer<typeof createWatchlistSchema>;
export type AddSymbolInput = z.infer<typeof addSymbolSchema>;
