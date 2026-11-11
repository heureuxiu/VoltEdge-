import { Router } from 'express';
import * as admin from '../controllers/admin.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import {
  messagePatchSchema,
  orderStatusSchema,
  productPatchSchema,
  productSchema,
  repairCreateSchema,
  repairPatchSchema,
  settingsSchema,
  tradeInStatusSchema,
} from '../validators/admin.validator';

/** Everything below needs a valid admin JWT. */
export const adminRouter = Router();
adminRouter.use(authenticate);

adminRouter.get('/bootstrap', admin.bootstrap);

adminRouter.patch('/orders/:id/status', validate(orderStatusSchema), admin.setOrderStatus);

adminRouter.post('/products', validate(productSchema), admin.createProduct);
adminRouter.patch('/products/:id', validate(productPatchSchema), admin.updateProduct);
adminRouter.delete('/products/:id', admin.deleteProduct);

adminRouter.post('/repairs', validate(repairCreateSchema), admin.createRepair);
adminRouter.patch('/repairs/:id', validate(repairPatchSchema), admin.updateRepair);

adminRouter.patch('/trade-ins/:id/status', validate(tradeInStatusSchema), admin.setTradeInStatus);

adminRouter.put('/settings', validate(settingsSchema), admin.updateSettings);

adminRouter.patch('/messages/:id', validate(messagePatchSchema), admin.updateMessage);
