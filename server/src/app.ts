import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOrigins, isProduction } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // The API is called from other origins (storefront and admin); allow them to load JSON and images.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || corsOrigins.includes(origin.replace(/\/+$/, ''))),
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(morgan(isProduction ? 'combined' : 'dev'));
  if (isProduction) app.set('trust proxy', 1);

  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
