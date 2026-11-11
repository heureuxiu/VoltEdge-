import { model, Schema } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export const REPAIR_STATUSES = ['Diagnosing', 'In progress', 'Waiting on part', 'Quality check', 'Ready to collect'] as const;
export type RepairStatus = (typeof REPAIR_STATUSES)[number];

export interface RepairDoc {
  _id: string;
  customer: string;
  email: string;
  phone: string;
  device: string;
  issue: string;
  notes: string;
  method: string;
  when: string;
  quote: number;
  status: RepairStatus;
  source: 'website' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<RepairDoc>(
  {
    _id: { type: String, required: true }, // RP-3392
    customer: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true, trim: true, index: true },
    phone: { type: String, default: '', trim: true },
    device: { type: String, required: true, trim: true },
    issue: { type: String, required: true, trim: true },
    notes: { type: String, default: '' },
    method: { type: String, default: 'Walk in / drop off' },
    when: { type: String, default: '' },
    quote: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: REPAIR_STATUSES, default: 'Diagnosing' },
    source: { type: String, enum: ['website', 'admin'], default: 'website' },
  },
  jsonOptions(),
);

export const Repair = model<RepairDoc>('Repair', schema);
