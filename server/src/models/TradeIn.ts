import { model, Schema } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export const TRADE_IN_STATUSES = ['Awaiting check-in', 'Checked — credit issued', 'Declined — device faulty'] as const;
export type TradeInStatus = (typeof TRADE_IN_STATUSES)[number];

export interface TradeInDoc {
  _id: string;
  customer: string;
  email: string;
  phone: string;
  device: string;
  answers: { cracked: boolean; damage: boolean; powers: boolean };
  grade: 'A' | 'B' | 'C';
  creditMin: number;
  creditMax: number;
  status: TradeInStatus;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<TradeInDoc>(
  {
    _id: { type: String, required: true }, // TI-2211
    customer: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    device: { type: String, required: true, trim: true }, // "iPhone 14 · 128GB"
    answers: {
      cracked: { type: Boolean, default: false },
      damage: { type: Boolean, default: false },
      powers: { type: Boolean, default: true },
    },
    grade: { type: String, enum: ['A', 'B', 'C'], required: true },
    creditMin: { type: Number, required: true, min: 0 },
    creditMax: { type: Number, required: true, min: 0 },
    status: { type: String, enum: TRADE_IN_STATUSES, default: 'Awaiting check-in' },
  },
  jsonOptions(),
);

export const TradeIn = model<TradeInDoc>('TradeIn', schema);
