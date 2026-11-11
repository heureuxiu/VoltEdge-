import { model, Schema } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export interface SettingsDoc {
  _id: string;
  storeName: string;
  supportEmail: string;
  whatsapp: string;
  lowStockThreshold: number;
  standardShipping: number;
  expressShipping: number;
  notifyNewOrder: boolean;
  notifyLowStock: boolean;
  notifyRepairReady: boolean;
}

const schema = new Schema<SettingsDoc>(
  {
    _id: { type: String, default: 'store' },
    storeName: { type: String, default: 'VoltEdge' },
    supportEmail: { type: String, default: 'support@voltedge.co.za' },
    whatsapp: { type: String, default: '+27 82 555 0100' },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
    standardShipping: { type: Number, default: 99, min: 0 },
    expressShipping: { type: Number, default: 199, min: 0 },
    notifyNewOrder: { type: Boolean, default: true },
    notifyLowStock: { type: Boolean, default: true },
    notifyRepairReady: { type: Boolean, default: true },
  },
  jsonOptions((ret) => {
    delete ret.id;
    delete ret.createdAt;
    delete ret.updatedAt;
  }),
);

export const Settings = model<SettingsDoc>('Settings', schema);
