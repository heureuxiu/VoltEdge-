import type { RequestHandler } from 'express';
import { verifyToken } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';

/** Require a valid `Authorization: Bearer <jwt>` header and attach `req.auth`. */
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(ApiError.unauthorized());
  try {
    const payload = verifyToken(header.slice('Bearer '.length));
    req.auth = { userId: payload.sub, email: payload.email, name: payload.name, role: payload.role };
    next();
  } catch (error) {
    next(error);
  }
};
