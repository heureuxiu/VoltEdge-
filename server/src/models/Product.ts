import { model, Schema } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export const PRODUCT_CATEGORIES = ['iphone', 'samsung', 'gadgets'] as const;
export const PRODUCT_TYPES = ['phone', 'laptop', 'audio'] as const;

export interface ProductDoc {
  _id: string;
  type: (typeof PRODUCT_TYPES)[number];
  brand: string;
  name: string;
  spec: string;
  badge: string;
  category: (typeof PRODUCT_CATEGORIES)[number];
  image: string;
  tint: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  active: boolean;
  position: number;
}

const schema = new Schema<ProductDoc>(
  {
    _id: { type: String, required: true }, // URL slug, e.g. "iphone-17-pro-max"
    type: { type: String, enum: PRODUCT_TYPES, default: 'phone' },
    brand: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    spec: { type: String, default: '', trim: true },
    badge: { type: String, default: 'New', trim: true },
    category: { type: String, enum: PRODUCT_CATEGORIES, required: true },
    image: { type: String, required: true },
    tint: { type: String, default: 'bg-[#f4f4f5]' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    active: { type: Boolean, default: true },
    /** Sort position in the shop (lower first). New products default to the end. */
    position: { type: Number, default: () => Date.now(), index: true },
  },
  jsonOptions(),
);
schema.index({ category: 1, active: 1 });

export const Product = model<ProductDoc>('Product', schema);
