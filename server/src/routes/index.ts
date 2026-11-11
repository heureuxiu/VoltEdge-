import { Router } from 'express';
import { adminRouter } from './admin.routes';
import { authRouter } from './auth.routes';
import { storeRouter } from './store.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ data: { status: 'ok', time: new Date().toISOString() } }));
apiRouter.use('/auth', authRouter);
apiRouter.use('/store', storeRouter);
apiRouter.use('/admin', adminRouter);
