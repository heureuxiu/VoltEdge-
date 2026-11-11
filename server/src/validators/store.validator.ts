import { z } from 'zod';

const text = (max = 200) => z.string().trim().min(1).max(max);
const email = z.string().trim().toLowerCase().email().max(200);
const phone = z.string().trim().min(5).max(40);

export const checkoutSchema = z
  .object({
    items: z
      .array(z.object({ productId: text(100), qty: z.coerce.number().int().min(1).max(9), variant: z.string().trim().max(200).optional() }))
      .min(1)
      .max(30),
    contact: z.object({ email, phone, firstName: text(80), lastName: text(80) }),
    delivery: z.enum(['ship', 'pickup']),
    shippingMethod: z.enum(['standard', 'express']).default('standard'),
    address: z
      .object({
        line1: text(200),
        line2: z.string().trim().max(200).optional(),
        city: text(100),
        province: z.string().trim().max(100).optional(),
        postal: text(20),
        country: z.string().trim().max(2).optional(),
      })
      .optional(),
    payment: z.enum(['card', 'payflex', 'eft']),
    notes: z.string().trim().max(1000).optional(),
  })
  .refine((v) => v.delivery === 'pickup' || !!v.address, { message: 'A delivery address is required', path: ['address'] });

export const repairBookingSchema = z.object({
  name: text(100),
  email,
  phone,
  device: text(150),
  issues: z.array(text(100)).min(1).max(10),
  method: text(100),
  when: text(100),
  notes: z.string().trim().max(1000).optional(),
});

const answers = z.object({ cracked: z.boolean(), damage: z.boolean(), powers: z.boolean() });

export const tradeInEstimateSchema = z.object({ model: text(80), storage: text(20), answers });

export const tradeInRequestSchema = tradeInEstimateSchema.extend({ name: text(100), email, phone });

export const contactSchema = z.object({
  topic: z.string().trim().max(80).default('Something else'),
  name: text(100),
  contact: text(200),
  message: text(3000),
});

export const newsletterSchema = z.object({ email });

export const trackQuerySchema = z.object({
  kind: z.enum(['order', 'repair']),
  ref: text(30),
  email,
});
