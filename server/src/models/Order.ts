import { model, Schema } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export const ORDER_STATUSES = ['Pending payment', 'Packed', 'In transit', 'Delivered', 'Cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  productId: string;
  name: string;
  variant: string;
  image: string;
  qty: number;
  unitPrice: number;
}

export interface OrderDoc {
  _id: string;
  customer: string;
  email: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  delivery: 'ship' | 'pickup';
  shippingMethod: 'standard' | 'express' | 'pickup';
  address?: { line1: string; line2: string; city: string; province: string; postal: string; country: string };
  payment: 'card' | 'payflex' | 'eft';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<OrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    variant: { type: String, default: '' },
    image: { type: String, default: '' },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const schema = new Schema<OrderDoc>(
  {
    _id: { type: String, required: true }, // VE-10483
    customer: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: '', trim: true },
    items: { type: [itemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'Pending payment' },
    delivery: { type: String, enum: ['ship', 'pickup'], default: 'ship' },
    shippingMethod: { type: String, enum: ['standard', 'express', 'pickup'], default: 'standard' },
    address: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      city: { type: String, default: '' },
      province: { type: String, default: '' },
      postal: { type: String, default: '' },
      country: { type: String, default: 'ZA' },
    },
    payment: { type: String, enum: ['card', 'payflex', 'eft'], default: 'card' },
    notes: { type: String, default: '' },
  },
  jsonOptions((ret) => {
    ret.date = ret.createdAt;
    const items = (ret.items as { name: string; qty: number }[]) ?? [];
    ret.item = items.map((i) => `${i.name} ×${i.qty}`).join(', ');
  }),
);

export const Order = model<OrderDoc>('Order', schema);
