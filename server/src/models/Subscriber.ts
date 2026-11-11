import { model, Schema } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export interface SubscriberDoc {
  email: string;
}

const schema = new Schema<SubscriberDoc>({ email: { type: String, required: true, unique: true, lowercase: true, trim: true } }, jsonOptions());

export const Subscriber = model<SubscriberDoc>('Subscriber', schema);
