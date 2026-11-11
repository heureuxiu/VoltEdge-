import { Settings } from '../models/Settings';

/** The store has a single settings document; create it with defaults on first use. */
export async function getSettings() {
  const doc = await Settings.findByIdAndUpdate('store', { $setOnInsert: { _id: 'store' } }, { upsert: true, new: true });
  return doc;
}
