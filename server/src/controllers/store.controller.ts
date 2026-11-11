import { REPAIR_FROM_PRICES, TRADE_IN_MODELS, TRADE_IN_STORAGE, estimateCredit, gradeFromAnswers } from '../config/pricing';
import { Message } from '../models/Message';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Repair } from '../models/Repair';
import { Subscriber } from '../models/Subscriber';
import { TradeIn } from '../models/TradeIn';
import { logActivity } from '../services/activity.service';
import { upsertCustomer } from '../services/customer.service';
import { nextId } from '../services/id.service';
import { createOrder, type CheckoutInput } from '../services/order.service';
import { getSettings } from '../services/settings.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ active: true }).sort({ position: 1, name: 1 });
  res.json({ data: products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, active: true });
  if (!product) throw ApiError.notFound('Product not found');
  res.json({ data: product });
});

/** Public store settings the website needs: shipping fees, contact details and price lists. */
export const getConfig = asyncHandler(async (_req, res) => {
  const s = await getSettings();
  res.json({
    data: {
      storeName: s.storeName,
      supportEmail: s.supportEmail,
      whatsapp: s.whatsapp,
      shipping: { standard: s.standardShipping, express: s.expressShipping },
      repairPrices: REPAIR_FROM_PRICES,
      tradeIn: { models: TRADE_IN_MODELS, storage: TRADE_IN_STORAGE },
    },
  });
});

export const checkout = asyncHandler(async (req, res) => {
  const order = await createOrder(req.body as CheckoutInput);
  await logActivity(`New order ${order._id} from ${order.customer}`, 'order', 'Website');
  res.status(201).json({
    data: {
      id: String(order._id),
      status: order.status,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      email: order.email,
      payment: order.payment,
      delivery: order.delivery,
      shippingMethod: order.shippingMethod,
    },
  });
});

interface RepairBody {
  name: string;
  email: string;
  phone: string;
  device: string;
  issues: string[];
  method: string;
  when: string;
  notes?: string;
}

export const bookRepair = asyncHandler(async (req, res) => {
  const b = req.body as RepairBody;
  const repair = await Repair.create({
    _id: await nextId('repair'),
    customer: b.name,
    email: b.email,
    phone: b.phone,
    device: b.device,
    issue: b.issues.join(', '),
    notes: b.notes ?? '',
    method: b.method,
    when: b.when,
    quote: b.issues.reduce((sum, i) => sum + (REPAIR_FROM_PRICES[i] ?? 0), 0),
    source: 'website',
  });
  await upsertCustomer({ name: b.name, email: b.email, phone: b.phone });
  await logActivity(`Repair ${repair._id} booked online by ${b.name}`, 'repair', 'Website');
  res.status(201).json({ data: { id: String(repair._id), when: repair.when, estimate: repair.quote } });
});

interface TradeInBody {
  model: string;
  storage: string;
  answers: { cracked: boolean; damage: boolean; powers: boolean };
  name?: string;
  email?: string;
  phone?: string;
}

export const estimateTradeIn = asyncHandler(async (req, res) => {
  const b = req.body as TradeInBody;
  const grade = gradeFromAnswers(b.answers);
  res.json({ data: { grade, ...estimateCredit(b.model, b.storage, grade) } });
});

export const requestTradeIn = asyncHandler(async (req, res) => {
  const b = req.body as Required<TradeInBody>;
  const grade = gradeFromAnswers(b.answers);
  const { min, max } = estimateCredit(b.model, b.storage, grade);
  const tradeIn = await TradeIn.create({
    _id: await nextId('tradeIn'),
    customer: b.name,
    email: b.email,
    phone: b.phone,
    device: `${b.model} · ${b.storage}`,
    answers: b.answers,
    grade,
    creditMin: min,
    creditMax: max,
  });
  await upsertCustomer({ name: b.name, email: b.email, phone: b.phone });
  await logActivity(`Trade-in ${tradeIn._id} requested by ${b.name}`, 'trade-in', 'Website');
  res.status(201).json({ data: { id: String(tradeIn._id), grade, creditMin: min, creditMax: max } });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const b = req.body as { topic: string; name: string; contact: string; message: string };
  await Message.create(b);
  await logActivity(`New website message from ${b.name} (${b.topic})`, 'message', 'Website');
  res.status(201).json({ data: { ok: true } });
});

export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body as { email: string };
  await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
  res.status(201).json({ data: { ok: true } });
});

const ORDER_STEPS: [string, string][] = [
  ['Order placed', 'We have your order'],
  ['Packed', 'Device checked & boxed'],
  ['On the way', 'With our courier'],
  ['Out for delivery', 'Arriving soon'],
  ['Delivered', 'Enjoy your new tech'],
];
const ORDER_CURRENT: Record<string, number> = { 'Pending payment': 0, Packed: 1, 'In transit': 2, Delivered: 5 };

const REPAIR_STEPS: [string, string][] = [
  ['Booked in', 'Booking received'],
  ['Diagnosed', 'We check the device and confirm the quote'],
  ['Repair in progress', 'Our technician is working on it'],
  ['Quality check', 'Full function test'],
  ['Ready to collect', "We'll message you"],
];
const REPAIR_CURRENT: Record<string, number> = { Diagnosing: 1, 'In progress': 2, 'Waiting on part': 2, 'Quality check': 3, 'Ready to collect': 5 };

/** Order/repair lookup. The reference alone is not enough: the email must match too. */
export const track = asyncHandler(async (req, res) => {
  const { kind, ref, email } = req.query as unknown as { kind: 'order' | 'repair'; ref: string; email: string };
  const notFound = ApiError.notFound("We couldn't find that reference with that email address.");
  const id = ref.toUpperCase();

  if (kind === 'order') {
    const order = await Order.findById(id);
    if (!order || order.email !== email) throw notFound;
    const first = order.items[0];
    const cancelled = order.status === 'Cancelled';
    res.json({
      data: {
        kind,
        ref: String(order._id),
        status: order.status,
        cancelled,
        title: cancelled ? 'This order was cancelled' : order.status === 'Delivered' ? 'Your order was delivered' : order.status === 'Pending payment' ? 'We are waiting for your payment' : 'Your order is on the way',
        steps: ORDER_STEPS,
        current: cancelled ? -1 : (ORDER_CURRENT[order.status] ?? 0),
        item: first?.name ?? 'Order',
        itemSub: order.items.length > 1 ? `+ ${order.items.length - 1} more item${order.items.length > 2 ? 's' : ''}` : (first?.variant ?? ''),
        image: first?.image ?? '',
        amount: order.total,
        placedAt: order.createdAt,
        location: order.delivery === 'pickup' ? 'Collect in store' : 'Delivery',
      },
    });
    return;
  }

  const repair = await Repair.findById(id);
  if (!repair || repair.email !== email) throw notFound;
  res.json({
    data: {
      kind,
      ref: String(repair._id),
      status: repair.status,
      cancelled: false,
      title: repair.status === 'Ready to collect' ? 'Your device is ready to collect' : repair.status === 'Waiting on part' ? 'We are waiting on a part for your repair' : 'Your repair is in progress',
      steps: REPAIR_STEPS,
      current: REPAIR_CURRENT[repair.status] ?? 1,
      item: repair.device,
      itemSub: repair.issue,
      image: '',
      amount: repair.quote,
      placedAt: repair.createdAt,
      location: repair.method,
    },
  });
});
