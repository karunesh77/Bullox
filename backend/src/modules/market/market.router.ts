import { Router } from 'express';
import { quote, bulkQuotes, candles, search, topCrypto, movers } from './market.controller';

const router = Router();

router.get('/search', search);               // GET /api/v1/market/search?q=AAPL
router.get('/quotes', bulkQuotes);           // GET /api/v1/market/quotes?symbols=AAPL,TSLA
router.get('/quote/:symbol', quote);         // GET /api/v1/market/quote/AAPL
router.get('/candles/:symbol', candles);     // GET /api/v1/market/candles/AAPL?interval=D
router.get('/crypto', topCrypto);            // GET /api/v1/market/crypto
router.get('/movers', movers);               // GET /api/v1/market/movers?type=gainers

export default router;
