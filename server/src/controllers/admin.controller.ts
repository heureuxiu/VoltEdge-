import { ActivityLog } from '../models/ActivityLog';
import { Customer } from '../models/Customer';
import { Message } from '../models/Message';
import { Order, type OrderStatus } from '../models/Order';
import { Product } from '../models/Product';
import { Repair } from '../models/Repair';
import { Settings } from '../models/Settings';
import { Subscriber } from '../models/Subscriber';
import { TradeIn } from '../models/TradeIn';
import { logActivity } from '../services/activity.service';
import { upsertCustomer } from '../services/customer.service';
import { nextId } from '../services/id.service';
import { applyOrderStatus } from '../services/order.service';
import { getSettings } from '../services/settings.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const actor = (req: { auth?: { name: string } }) => req.auth?.name ?? 'Admin';

/** Everything the admin panel shows, in one request. */
export const bootstrap = asyncHandler(async (_req, res) => {
  const [orders, products, repairs, tradeIns, customers, activity, messages, settings, subscribers] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(1000),
    Product.find().sort({ position: 1, name: 1 }),
    Repair.find().sort({ createdAt: -1 }).limit(1000),
    TradeIn.find().sort({ createdAt: -1 }).limit(1000),
    Customer.find().sort({ createdAt: -1 }),
    ActivityLog.find().sort({ createdAt: -1 }).limit(100),
    Message.find().sort({ createdAt: -1 }).limit(300),
    getSettings(),
    Subscriber.countDocuments(),
  ]);
  res.json({ data: { orders, products, repairs, tradeIns, customers, activity, messages, settings, subscribers } });
});

/* -------------------------------- orders -------------------------------- */

export const setOrderStatus = asyncHandler(async (req, res) => {
  const order = await applyOrderStatus(req.params.id, (req.body as { status: OrderStatus }).status);
  await logActivity(`Order ${order._id} marked ${order.status}`, 'order', actor(req));
  const products = await Product.find({ _id: { $in: order.items.map((i) => i.productId) } });
  res.json({ data: { order, products } });
});

/* ------------------------------- products ------------------------------- */

const BRAND: Record<string, string> = { iphone: 'Apple', samsung: 'Samsung' };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'product';

export const createProduct = asyncHandler(async (req, res) => {
  const b = req.body as Record<string, any>;
  let id = slugify(b.name);
  for (let n = 2; await Product.exists({ _id: id }); n++) id = `${slugify(b.name)}-${n}`;
  const isLaptop = /macbook|laptop|notebook/i.test(b.name);
  const product = await Product.create({
    _id: id,
    name: b.name,
    spec: b.spec,
    category: b.category,
    price: b.price,
    stock: b.stock,
    compareAtPrice: b.compareAtPrice ?? null,
    brand: b.brand ?? BRAND[b.category] ?? b.name.split(' ')[0],
    type: b.type ?? (b.category === 'gadgets' ? (isLaptop ? 'laptop' : 'audio') : 'phone'),
    badge: b.badge ?? 'New',
    image: b.image ?? (b.category === 'gadgets' ? '/images/categories/accessories.svg' : '/images/categories/phones.svg'),
    tint: b.tint ?? 'bg-[#f4f4f5]',
    active: b.active ?? true,
  });
  await logActivity(`Product added: ${product.name}`, 'product', actor(req));
  res.status(201).json({ data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const patch = req.body as Record<string, unknown>;
  const product = await Product.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
  if (!product) throw ApiError.notFound('Product not found');
  const onlyStock = Object.keys(patch).length === 1 && 'stock' in patch;
  await logActivity(onlyStock ? `Stock updated for ${product.name} (${product.stock} left)` : `Product updated: ${product.name}`, 'product', actor(req));
  res.json({ data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');
  await logActivity(`Product removed: ${product.name}`, 'product', actor(req));
  res.json({ data: { id: String(product._id) } });
});

/* -------------------------------- repairs ------------------------------- */

export const createRepair = asyncHandler(async (req, res) => {
  const b = req.body as { customer: string; device: string; issue: string; when: string; quote: number; email?: string; phone?: string };
  const repair = await Repair.create({ _id: await nextId('repair'), ...b, source: 'admin', method: 'Walk in / drop off' });
  if (b.email) await upsertCustomer({ name: b.customer, email: b.email, phone: b.phone });
  await logActivity(`Repair ${repair._id} booked for ${repair.customer}`, 'repair', actor(req));
  res.status(201).json({ data: repair });
});

export const updateRepair = asyncHandler(async (req, res) => {
  const patch = req.body as { status?: string; quote?: number };
  const repair = await Repair.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
  if (!repair) throw ApiError.notFound('Repair not found');
  await logActivity(patch.status ? `Repair ${repair._id} → ${repair.status}` : `Repair ${repair._id} quote set to R${repair.quote}`, 'repair', actor(req));
  res.json({ data: repair });
});

/* ------------------------------- trade-ins ------------------------------ */

export const setTradeInStatus = asyncHandler(async (req, res) => {
  const tradeIn = await TradeIn.findByIdAndUpdate(req.params.id, { status: (req.body as { status: string }).status }, { new: true, runValidators: true });
  if (!tradeIn) throw ApiError.notFound('Trade-in not found');
  await logActivity(`Trade-in ${tradeIn._id}: ${tradeIn.status}`, 'trade-in', actor(req));
  res.json({ data: tradeIn });
});

/* ------------------------------- settings ------------------------------- */

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findByIdAndUpdate('store', { $set: req.body as object }, { upsert: true, new: true, runValidators: true });
  await logActivity('Store settings updated', 'settings', actor(req));
  res.json({ data: settings });
});

/* ------------------------------- messages ------------------------------- */

export const updateMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { handled: (req.body as { handled: boolean }).handled }, { new: true });
  if (!message) throw ApiError.notFound('Message not found');
  res.json({ data: message });
});
