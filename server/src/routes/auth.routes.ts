import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as auth from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators/admin.validator';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many sign-in attempts. Try again in a few minutes.' } },
});

authRouter.post('/login', loginLimiter, validate(loginSchema), auth.login);
authRouter.get('/me', authenticate, auth.me);
