import { model, Schema } from 'mongoose';
import { jsonOptions } from './schemaOptions';

export const ACTIVITY_KINDS = ['order', 'product', 'repair', 'trade-in', 'settings', 'auth', 'message'] as const;
export type ActivityKind = (typeof ACTIVITY_KINDS)[number];

export interface ActivityLogDoc {
  text: string;
  kind: ActivityKind;
  actor: string;
  createdAt: Date;
}

const schema = new Schema<ActivityLogDoc>(
  {
    text: { type: String, required: true },
    kind: { type: String, enum: ACTIVITY_KINDS, required: true },
    actor: { type: String, default: 'System' },
  },
  jsonOptions((ret) => {
    ret.at = ret.createdAt;
  }),
);
schema.index({ createdAt: -1 });

export const ActivityLog = model<ActivityLogDoc>('ActivityLog', schema);
