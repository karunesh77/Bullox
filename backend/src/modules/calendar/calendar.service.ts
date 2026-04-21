import axios from 'axios';
import { ENV } from '../../config/env';
import { getRedis } from '../../config/redis';
import { CalendarEvent, ImpactLevel } from '../../types/calendar';
import { logger } from '../../utils/logger';

const finnhub = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: { token: ENV.FINNHUB_API_KEY },
  timeout: 8000,
});

// Country → currency map
const COUNTRY_CURRENCY: Record<string, string> = {
  US: 'USD', IN: 'INR', EU: 'EUR', GB: 'GBP',
  JP: 'JPY', AU: 'AUD', CA: 'CAD', CN: 'CNY',
  CH: 'CHF', NZ: 'NZD',
};

// Impact number → label
const impactLabel = (impact: number): ImpactLevel => {
  if (impact >= 3) return 'high';
  if (impact === 2) return 'medium';
  return 'low';
};

// ── Cache Helper ──────────────────────────────────────────
const getFromCache = async (key: string) => {
  const redis = getRedis();
  if (!redis) return null;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key: string, data: any, ttlSeconds: number) => {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
};

// ── Fetch from Finnhub ────────────────────────────────────
const fetchFromFinnhub = async (from: string, to: string): Promise<CalendarEvent[]> => {
  if (!ENV.FINNHUB_API_KEY) {
    logger.warn('⚠️  Finnhub API key not set — returning mock calendar data');
    return getMockCalendarEvents();
  }

  try {
    const { data } = await finnhub.get('/calendar/economic', {
      params: { from, to },
    });

    return (data.economicCalendar || []).map((item: any, idx: number) => ({
      id: `${item.event}-${item.time}-${idx}`,
      title: item.event,
      country: item.country,
      date: item.time?.split(' ')[0] || from,
      time: item.time?.split(' ')[1] || '00:00:00',
      impact: impactLabel(item.impact || 1),
      forecast: item.estimate !== undefined ? String(item.estimate) : null,
      previous: item.prev !== undefined ? String(item.prev) : null,
      actual: item.actual !== undefined ? String(item.actual) : null,
      currency: COUNTRY_CURRENCY[item.country] || item.country,
      unit: item.unit || '',
    }));
  } catch (error: any) {
    logger.warn(`Finnhub calendar failed: ${error.message}`);
    return getMockCalendarEvents();
  }
};

// ── Mock Data (when no API key) ───────────────────────────
const getMockCalendarEvents = (): CalendarEvent[] => {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'mock-1', title: 'US Non-Farm Payrolls', country: 'US',
      date: today, time: '08:30:00', impact: 'high',
      forecast: '185K', previous: '175K', actual: null, currency: 'USD', unit: 'K',
    },
    {
      id: 'mock-2', title: 'US CPI (YoY)', country: 'US',
      date: today, time: '08:30:00', impact: 'high',
      forecast: '3.2%', previous: '3.5%', actual: null, currency: 'USD', unit: '%',
    },
    {
      id: 'mock-3', title: 'RBI Interest Rate Decision', country: 'IN',
      date: today, time: '10:00:00', impact: 'high',
      forecast: '6.50%', previous: '6.50%', actual: null, currency: 'INR', unit: '%',
    },
    {
      id: 'mock-4', title: 'ECB Interest Rate Decision', country: 'EU',
      date: today, time: '12:45:00', impact: 'high',
      forecast: '4.0%', previous: '4.25%', actual: null, currency: 'EUR', unit: '%',
    },
    {
      id: 'mock-5', title: 'UK GDP (MoM)', country: 'GB',
      date: today, time: '07:00:00', impact: 'medium',
      forecast: '0.2%', previous: '0.1%', actual: null, currency: 'GBP', unit: '%',
    },
    {
      id: 'mock-6', title: 'US Initial Jobless Claims', country: 'US',
      date: today, time: '08:30:00', impact: 'medium',
      forecast: '215K', previous: '212K', actual: null, currency: 'USD', unit: 'K',
    },
  ];
};

// ── Get Calendar Events ───────────────────────────────────
export const getCalendarEvents = async (
  from: string,
  to: string,
  country?: string,
  impact?: ImpactLevel
): Promise<CalendarEvent[]> => {
  const cacheKey = `calendar:${from}:${to}:${country || 'all'}:${impact || 'all'}`;

  const cached = await getFromCache(cacheKey);
  if (cached) return cached;

  let events = await fetchFromFinnhub(from, to);

  // Filter by country
  if (country) {
    events = events.filter((e) => e.country === country.toUpperCase());
  }

  // Filter by impact
  if (impact) {
    events = events.filter((e) => e.impact === impact);
  }

  // Sort by date + time
  events.sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time}`).getTime();
    const timeB = new Date(`${b.date}T${b.time}`).getTime();
    return timeA - timeB;
  });

  // Cache for 1 hour
  await setCache(cacheKey, events, 3600);

  return events;
};

// ── Today's Events ────────────────────────────────────────
export const getTodayEvents = async (): Promise<CalendarEvent[]> => {
  const today = new Date().toISOString().split('T')[0];
  return getCalendarEvents(today, today);
};

// ── High Impact Events ────────────────────────────────────
export const getHighImpactEvents = async (from: string, to: string): Promise<CalendarEvent[]> => {
  return getCalendarEvents(from, to, undefined, 'high');
};

// ── Supported Countries ───────────────────────────────────
export const getSupportedCountries = () => {
  return Object.entries(COUNTRY_CURRENCY).map(([code, currency]) => ({
    code, currency,
  }));
};
