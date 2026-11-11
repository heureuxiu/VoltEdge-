import { model, Schema, type Types } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export interface AdminUserDoc {
  _id: Types.ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin';
  disabled: boolean;
}

const schema = new Schema<AdminUserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
    disabled: { type: Boolean, default: false },
  },
  jsonOptions((ret) => {
    delete ret.passwordHash;
  }),
);

export const AdminUser = model<AdminUserDoc>('AdminUser', schema);
