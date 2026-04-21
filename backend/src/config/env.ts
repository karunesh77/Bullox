import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000'),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  MONGODB_URI: process.env.MONGODB_URI || '',
  REDIS_URL: process.env.REDIS_URL || '',

  // Auth
  JWT_SECRET: process.env.JWT_SECRET || 'changeme-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'changeme-refresh',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',

  // Market Data
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || '',
  TWELVEDATA_API_KEY: process.env.TWELVEDATA_API_KEY || '',
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY || '',

  // News
  NEWSAPI_KEY: process.env.NEWSAPI_KEY || '',

  // AI
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',

  // Payments
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',

  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@bullox.in',
};
