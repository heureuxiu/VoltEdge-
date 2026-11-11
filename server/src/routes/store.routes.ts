import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as store from '../controllers/store.controller';
import { validate } from '../middleware/validate';
import {
  checkoutSchema,
  contactSchema,
  newsletterSchema,
  repairBookingSchema,
  tradeInEstimateSchema,
  tradeInRequestSchema,
  trackQuerySchema,
} from '../validators/store.validator';

/** Public routes used by the storefront. No sign-in; writes are rate limited per IP. */
export const storeRouter = Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many requests. Please try again in a few minutes.' } },
});
const lookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many lookups. Please try again in a few minutes.' } },
});

storeRouter.get('/products', store.listProducts);
storeRouter.get('/products/:id', store.getProduct);
storeRouter.get('/config', store.getConfig);

storeRouter.post('/orders', writeLimiter, validate(checkoutSchema), store.checkout);
storeRouter.post('/repairs', writeLimiter, validate(repairBookingSchema), store.bookRepair);
storeRouter.post('/trade-ins/estimate', tradeInEstimateSchemaLimiter(), validate(tradeInEstimateSchema), store.estimateTradeIn);
storeRouter.post('/trade-ins', writeLimiter, validate(tradeInRequestSchema), store.requestTradeIn);
storeRouter.post('/contact', writeLimiter, validate(contactSchema), store.sendMessage);
storeRouter.post('/newsletter', writeLimiter, validate(newsletterSchema), store.subscribe);
storeRouter.get('/track', lookupLimiter, validate(trackQuerySchema, 'query'), store.track);

function tradeInEstimateSchemaLimiter() {
  return rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false });
}
