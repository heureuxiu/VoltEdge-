import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { isProduction } from '../config/env';
import { ApiError } from '../utils/ApiError';

export const notFound: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/** Single place where every error becomes a consistent JSON response. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: { message: err.message, details: err.details } });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: Object.values(err.errors).map((e) => ({ path: e.path, message: e.message })),
      },
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: { message: `Invalid value for ${err.path}` } });
  }

  // Duplicate key (e.g. an email that already exists).
  if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    const fields = Object.keys((err as { keyPattern?: Record<string, unknown> }).keyPattern ?? {}).join(', ');
    return res.status(409).json({ error: { message: `Already exists${fields ? `: ${fields}` : ''}` } });
  }

  console.error('[error]', err);
  return res.status(500).json({
    error: { message: isProduction ? 'Internal server error' : String((err as Error)?.message ?? err) },
  });
};
