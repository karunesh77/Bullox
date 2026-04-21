import { Router } from 'express';
import { calendarEvents, todayEvents, highImpactEvents, supportedCountries } from './calendar.controller';

const router = Router();

router.get('/', calendarEvents);              // GET /api/v1/calendar?from=2026-04-21&to=2026-04-28&country=US&impact=high
router.get('/today', todayEvents);            // GET /api/v1/calendar/today
router.get('/high-impact', highImpactEvents); // GET /api/v1/calendar/high-impact
router.get('/countries', supportedCountries); // GET /api/v1/calendar/countries

export default router;
