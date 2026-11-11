import { Customer } from '../models/Customer';
import { nextId } from './id.service';

/** Create the customer on first contact, otherwise fill in details we did not have yet. */
export async function upsertCustomer(input: { name: string; email: string; phone?: string; city?: string }) {
  const email = input.email.trim().toLowerCase();
  if (!email) return null;
  const existing = await Customer.findOne({ email });
  if (existing) {
    let changed = false;
    if (!existing.phone && input.phone) ((existing.phone = input.phone), (changed = true));
    if (!existing.city && input.city) ((existing.city = input.city), (changed = true));
    if (changed) await existing.save();
    return existing;
  }
  try {
    return await Customer.create({ _id: await nextId('customer'), name: input.name, email, phone: input.phone ?? '', city: input.city ?? '' });
  } catch (error) {
    // Two requests for a brand-new customer raced: the other one won.
    if ((error as { code?: number }).code === 11000) return Customer.findOne({ email });
    throw error;
  }
}
