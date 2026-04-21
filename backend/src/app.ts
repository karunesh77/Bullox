import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env';
import authRouter from './modules/auth/auth.router';
import marketRouter from './modules/market/market.router';
import newsRouter from './modules/news/news.router';
import calendarRouter from './modules/calendar/calendar.router';
import alertsRouter from './modules/alerts/alerts.router';
import watchlistRouter from './modules/watchlist/watchlist.router';
import userRouter from './modules/user/user.router';
import subscriptionRouter from './modules/subscription/subscription.router';
import copytradingRouter from './modules/copytrading/copytrading.router';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: ENV.FRONTEND_URL,
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan('dev'));

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/market', marketRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/calendar', calendarRouter);
app.use('/api/v1/alerts', alertsRouter);
app.use('/api/v1/watchlists', watchlistRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/copytrading', copytradingRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Bullox API is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
