import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

type Source = 'body' | 'query' | 'params';

/** Parse and replace `req[source]` with the validated, typed value. ZodErrors go to the error handler. */
export const validate =
  (schema: ZodTypeAny, source: Source = 'body'): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(result.error);
    Object.defineProperty(req, source, { value: result.data, writable: true, configurable: true });
    next();
  };
