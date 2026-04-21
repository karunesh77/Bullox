import { z } from 'zod';

export const createOrderSchema = z.object({
  planId: z.enum(['pro_monthly', 'pro_yearly'], {
    errorMap: () => ({ message: 'Plan must be pro_monthly or pro_yearly' }),
  }),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  planId: z.enum(['pro_monthly', 'pro_yearly']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
