import { model, Schema } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export interface CustomerDoc {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: Date;
}

const schema = new Schema<CustomerDoc>(
  {
    _id: { type: String, required: true }, // CU-1012
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
  },
  jsonOptions((ret) => {
    ret.joined = ret.createdAt;
  }),
);

export const Customer = model<CustomerDoc>('Customer', schema);
