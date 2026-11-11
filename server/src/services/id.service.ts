import { Counter } from '../models/Counter';

const BASE = { order: 10000, repair: 3000, tradeIn: 2000, customer: 1000 } as const;
const PREFIX = { order: 'VE-', repair: 'RP-', tradeIn: 'TI-', customer: 'CU-' } as const;

export type IdKind = keyof typeof BASE;

/** Next human-friendly id such as VE-10483. Atomic, so concurrent requests never share a number. */
export async function nextId(kind: IdKind): Promise<string> {
  const counter = await Counter.findOneAndUpdate({ _id: kind }, { $inc: { seq: 1 } }, { upsert: true, new: true });
  return `${PREFIX[kind]}${BASE[kind] + counter.seq}`;
}

/** Make sure the next id is above an existing number (used by the seed script). */
export async function ensureCounterAtLeast(kind: IdKind, usedNumber: number) {
  const seq = usedNumber - BASE[kind];
  await Counter.updateOne({ _id: kind }, { $max: { seq } }, { upsert: true });
}
