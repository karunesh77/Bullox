import crypto from 'crypto';
import Razorpay from 'razorpay';
import prisma from '../../config/prisma';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';
import { CreateOrderInput, VerifyPaymentInput } from './subscription.validation';

// ── Plan config ───────────────────────────────────────────
export const PLANS = {
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    amount: 99900,      // ₹999 in paise
    currency: 'INR',
    durationDays: 30,
  },
  pro_yearly: {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    amount: 799900,     // ₹7999 in paise
    currency: 'INR',
    durationDays: 365,
  },
};

// ── Razorpay client (lazy init) ───────────────────────────
let razorpay: Razorpay | null = null;

const getRazorpay = (): Razorpay => {
  if (!razorpay) {
    if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys not configured');
    }
    razorpay = new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// ── Create Order ──────────────────────────────────────────
export const createOrder = async (userId: string, input: CreateOrderInput) => {
  const plan = PLANS[input.planId];
  const client = getRazorpay();

  const order = await client.orders.create({
    amount: plan.amount,
    currency: plan.currency,
    receipt: `receipt_${userId}_${Date.now()}`,
    notes: { userId, planId: input.planId },
  });

  return {
    orderId: order.id,
    amount: plan.amount,
    currency: plan.currency,
    planId: input.planId,
    planName: plan.name,
    keyId: ENV.RAZORPAY_KEY_ID,
  };
};

// ── Verify Payment & Upgrade User ─────────────────────────
export const verifyPayment = async (userId: string, input: VerifyPaymentInput) => {
  // Verify Razorpay signature
  const expectedSignature = crypto
    .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
    .update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== input.razorpay_signature) {
    throw new Error('Payment verification failed — invalid signature');
  }

  const plan = PLANS[input.planId];
  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() + plan.durationDays);

  // Upsert subscription record
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      razorpaySubId: input.razorpay_payment_id,
      planId: input.planId,
      status: 'active',
      currentPeriodEnd: periodEnd,
    },
    create: {
      userId,
      razorpaySubId: input.razorpay_payment_id,
      planId: input.planId,
      status: 'active',
      currentPeriodEnd: periodEnd,
    },
  });

  // Upgrade user role to PRO
  await prisma.user.update({
    where: { id: userId },
    data: { role: 'PRO' },
  });

  logger.info(`💎 User ${userId} upgraded to PRO (${input.planId}) until ${periodEnd.toISOString()}`);

  return { planId: input.planId, status: 'active', currentPeriodEnd: periodEnd };
};

// ── Get Subscription Status ───────────────────────────────
export const getSubscriptionStatus = async (userId: string) => {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!sub) return { plan: 'free', status: 'none', currentPeriodEnd: null };

  // Auto-expire check
  const isExpired = new Date() > sub.currentPeriodEnd;
  if (isExpired && sub.status === 'active') {
    await prisma.subscription.update({
      where: { userId },
      data: { status: 'expired' },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'USER' },
    });
    logger.info(`⏰ Subscription expired for user ${userId}`);
    return { plan: sub.planId, status: 'expired', currentPeriodEnd: sub.currentPeriodEnd };
  }

  return {
    plan: sub.planId,
    status: sub.status,
    currentPeriodEnd: sub.currentPeriodEnd,
  };
};

// ── Get Plans (public) ────────────────────────────────────
export const getPlans = () => Object.values(PLANS).map((p) => ({
  id: p.id,
  name: p.name,
  amount: p.amount,
  amountDisplay: `₹${p.amount / 100}`,
  currency: p.currency,
  durationDays: p.durationDays,
}));
