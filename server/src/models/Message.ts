import { model, Schema } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export interface MessageDoc {
  topic: string;
  name: string;
  contact: string;
  message: string;
  handled: boolean;
  createdAt: Date;
}

const schema = new Schema<MessageDoc>(
  {
    topic: { type: String, default: 'Something else', trim: true },
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    handled: { type: Boolean, default: false },
  },
  jsonOptions((ret) => {
    ret.at = ret.createdAt;
  }),
);
schema.index({ createdAt: -1 });

export const Message = model<MessageDoc>('Message', schema);
