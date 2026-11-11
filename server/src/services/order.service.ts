import { Order, type OrderStatus } from '../models/Order';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { upsertCustomer } from './customer.service';
import { nextId } from './id.service';
import { getSettings } from './settings.service';

export interface CheckoutInput {
  items: { productId: string; qty: number; variant?: string }[];
  contact: { email: string; phone: string; firstName: string; lastName: string };
  delivery: 'ship' | 'pickup';
  shippingMethod: 'standard' | 'express';
  address?: { line1: string; line2?: string; city: string; province?: string; postal: string; country?: string };
  payment: 'card' | 'payflex' | 'eft';
  notes?: string;
}

/**
 * Build an order from the cart. Prices come from the database, never from the browser,
 * and stock is reserved with an atomic conditional update (rolled back if any line fails).
 */
export async function createOrder(input: CheckoutInput) {
  const merged = new Map<string, { qty: number; variant: string }>();
  for (const line of input.items) {
    const prev = merged.get(line.productId);
    merged.set(line.productId, { qty: (prev?.qty ?? 0) + line.qty, variant: line.variant ?? prev?.variant ?? '' });
  }

  const products = await Product.find({ _id: { $in: [...merged.keys()] }, active: true });
  const byId = new Map(products.map((p) => [String(p._id), p]));
  for (const id of merged.keys()) if (!byId.has(id)) throw ApiError.badRequest(`A product in your cart is no longer available (${id}).`);

  const reserved: { id: string; qty: number }[] = [];
  const rollback = () => Promise.all(reserved.map((r) => Product.updateOne({ _id: r.id }, { $inc: { stock: r.qty } })));

  try {
    for (const [id, { qty }] of merged) {
      const res = await Product.updateOne({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty } });
      if (res.modifiedCount !== 1) {
        throw ApiError.conflict(`Sorry, only ${byId.get(id)!.stock} of "${byId.get(id)!.name}" left in stock.`);
      }
      reserved.push({ id, qty });
    }

    const settings = await getSettings();
    const items = [...merged].map(([id, { qty, variant }]) => {
      const p = byId.get(id)!;
      return { productId: id, name: p.name, variant, image: p.image, qty, unitPrice: p.price };
    });
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const pickup = input.delivery === 'pickup';
    const shipping = pickup ? 0 : input.shippingMethod === 'express' ? settings.expressShipping : settings.standardShipping;
    const name = `${input.contact.firstName} ${input.contact.lastName}`.trim();

    const order = await Order.create({
      _id: await nextId('order'),
      customer: name,
      email: input.contact.email,
      phone: input.contact.phone,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      delivery: input.delivery,
      shippingMethod: pickup ? 'pickup' : input.shippingMethod,
      address: pickup || !input.address ? undefined : input.address,
      payment: input.payment,
      notes: input.notes ?? '',
    });

    await upsertCustomer({ name, email: input.contact.email, phone: input.contact.phone, city: input.address?.city });
    return order;
  } catch (error) {
    await rollback();
    throw error;
  }
}

/** Cancelling returns the stock; moving a cancelled order back takes it out again (if there is enough). */
export async function applyOrderStatus(id: string, status: OrderStatus) {
  const order = await Order.findById(id);
  if (!order) throw ApiError.notFound('Order not found');
  const wasCancelled = order.status === 'Cancelled';
  if (status === 'Cancelled' && !wasCancelled) {
    await Promise.all(order.items.map((i) => Product.updateOne({ _id: i.productId }, { $inc: { stock: i.qty } })));
  } else if (status !== 'Cancelled' && wasCancelled) {
    for (const i of order.items) {
      const res = await Product.updateOne({ _id: i.productId, stock: { $gte: i.qty } }, { $inc: { stock: -i.qty } });
      if (res.modifiedCount !== 1) throw ApiError.conflict(`Not enough stock of ${i.name} to reopen this order.`);
    }
  }
  order.status = status;
  await order.save();
  return order;
}
