import { z } from 'zod';
import { ORDER_STATUSES } from '../models/Order';
import { PRODUCT_CATEGORIES, PRODUCT_TYPES } from '../models/Product';
import { REPAIR_STATUSES } from '../models/Repair';
import { TRADE_IN_STATUSES } from '../models/TradeIn';

const text = (max = 200) => z.string().trim().min(1).max(max);

export const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(200) });

export const orderStatusSchema = z.object({ status: z.enum(ORDER_STATUSES) });

export const productSchema = z.object({
  name: text(150),
  spec: z.string().trim().max(150).default(''),
  category: z.enum(PRODUCT_CATEGORIES),
  price: z.coerce.number().min(0).max(10_000_000),
  stock: z.coerce.number().int().min(0).max(100_000),
  compareAtPrice: z.coerce.number().min(0).max(10_000_000).nullable().optional(),
  brand: z.string().trim().max(80).optional(),
  type: z.enum(PRODUCT_TYPES).optional(),
  badge: z.string().trim().max(40).optional(),
  image: z.string().trim().max(500).optional(),
  tint: z.string().trim().max(80).optional(),
  active: z.boolean().optional(),
});
export const productPatchSchema = productSchema.partial();

export const repairCreateSchema = z.object({
  customer: text(100),
  device: text(150),
  issue: text(150),
  when: z.string().trim().max(100).default(''),
  quote: z.coerce.number().min(0).max(1_000_000).default(0),
  email: z.string().trim().email().optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional(),
});
export const repairPatchSchema = z
  .object({ status: z.enum(REPAIR_STATUSES), quote: z.coerce.number().min(0).max(1_000_000) })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });

export const tradeInStatusSchema = z.object({ status: z.enum(TRADE_IN_STATUSES) });

export const settingsSchema = z
  .object({
    storeName: text(80),
    supportEmail: z.string().trim().email(),
    whatsapp: text(40),
    lowStockThreshold: z.coerce.number().int().min(0).max(10_000),
    standardShipping: z.coerce.number().min(0).max(100_000),
    expressShipping: z.coerce.number().min(0).max(100_000),
    notifyNewOrder: z.boolean(),
    notifyLowStock: z.boolean(),
    notifyRepairReady: z.boolean(),
  })
  .partial();

export const messagePatchSchema = z.object({ handled: z.boolean() });
