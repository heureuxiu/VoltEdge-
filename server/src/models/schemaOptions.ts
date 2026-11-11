import type { SchemaOptions } from 'mongoose';

/**
 * JSON shape sent to clients: `_id` becomes `id`, `createdAt` stays available (and is also exposed
 * by some models under a friendlier name via `extra`). Typed with `any` so the same options can be
 * shared by every schema (our documents use string ids, which the default generic does not allow).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonOptions = (extra?: (ret: Record<string, any>) => void): SchemaOptions<any> => ({
  timestamps: true,
  versionKey: false,
  toJSON: {
    versionKey: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform: (_doc: unknown, ret: any) => {
      ret.id = String(ret._id);
      delete ret._id;
      extra?.(ret);
      return ret;
    },
  },
});
