/**
 * Fills an empty database with the starter catalogue, demo customers/orders/repairs/trade-ins and the admin login.
 *   npm run seed          adds anything that is missing and never overwrites existing records
 *   npm run seed:reset    wipes every collection first, then seeds
 */
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/db';
import { env } from '../config/env';
import { ActivityLog, AdminUser, Counter, Customer, Message, Order, Product, Repair, Settings, Subscriber, TradeIn } from '../models';
import { hashPassword } from '../services/auth.service';
import { ensureCounterAtLeast } from '../services/id.service';

const HOUR = 3_600_000;
const ago = (hours: number) => new Date(Date.now() - hours * HOUR);

const products = [
  { _id: 'iphone-17-pro-max', type: 'phone', brand: 'Apple', name: 'iPhone 17 Pro Max', spec: '256GB · New', badge: 'New', category: 'iphone', image: '/images/products/iphone-17-pro-max.webp', tint: 'bg-brand-soft', price: 34999, compareAtPrice: 37999, stock: 14 },
  { _id: 'iphone-17', type: 'phone', brand: 'Apple', name: 'iPhone 17', spec: '128GB · New', badge: 'New', category: 'iphone', image: '/images/products/iphone-17.webp', tint: 'bg-[#f4f4f5]', price: 24999, stock: 21 },
  { _id: 'iphone-15-pro', type: 'phone', brand: 'Apple', name: 'iPhone 15 Pro', spec: '128GB · Pre-owned', badge: 'Grade A', category: 'iphone', image: '/images/products/iphone-15-pro.webp', tint: 'bg-repair-soft', price: 18499, compareAtPrice: 21999, stock: 2 },
  { _id: 'galaxy-s25-ultra', type: 'phone', brand: 'Samsung', name: 'Galaxy S25 Ultra', spec: '256GB · New', badge: 'New', category: 'samsung', image: '/images/products/galaxy-s25-ultra.webp', tint: 'bg-[#f4f4f5]', price: 29999, compareAtPrice: 32999, stock: 9 },
  { _id: 'galaxy-s25', type: 'phone', brand: 'Samsung', name: 'Galaxy S25', spec: '128GB · New', badge: 'New', category: 'samsung', image: '/images/products/galaxy-s25.webp', tint: 'bg-[#f4f4f5]', price: 19999, stock: 17 },
  { _id: 'galaxy-a36', type: 'phone', brand: 'Samsung', name: 'Galaxy A36', spec: '128GB · New', badge: 'Best value', category: 'samsung', image: '/images/products/galaxy-a36.webp', tint: 'bg-accent-soft', price: 8499, stock: 31 },
  { _id: 'airpods-pro-3', type: 'audio', brand: 'Apple', name: 'AirPods Pro 3', spec: 'USB-C · ANC', badge: 'Audio', category: 'gadgets', image: '/images/products/airpods-pro-3.webp', tint: 'bg-[#f1f1f3]', price: 5499, stock: 5 },
  { _id: 'macbook-air', type: 'laptop', brand: 'Apple', name: 'MacBook Air 13"', spec: 'M4 · 256GB', badge: 'Laptop', category: 'gadgets', image: '/images/products/macbook-air.webp', tint: 'bg-brand-soft', price: 24999, compareAtPrice: 27999, stock: 0 },
];

const customers = [
  { _id: 'CU-1001', name: 'Thabo N.', email: 'thabo.n@mail.co.za', phone: '082 555 0141', city: 'Johannesburg', at: ago(24 * 240) },
  { _id: 'CU-1002', name: 'Aisha K.', email: 'aisha.k@mail.co.za', phone: '083 555 0172', city: 'Durban', at: ago(24 * 220) },
  { _id: 'CU-1003', name: 'Lerato M.', email: 'lerato.m@mail.co.za', phone: '071 555 0123', city: 'Pretoria', at: ago(24 * 200) },
  { _id: 'CU-1004', name: 'Juan P.', email: 'juan.p@mail.co.za', phone: '072 555 0188', city: 'Cape Town', at: ago(24 * 180) },
  { _id: 'CU-1005', name: 'Naledi S.', email: 'naledi.s@mail.co.za', phone: '084 555 0167', city: 'Johannesburg', at: ago(24 * 160) },
  { _id: 'CU-1006', name: 'Kyle B.', email: 'kyle.b@mail.co.za', phone: '060 555 0119', city: 'Port Elizabeth', at: ago(24 * 140) },
  { _id: 'CU-1007', name: 'Zanele P.', email: 'zanele.p@mail.co.za', phone: '073 555 0154', city: 'Centurion', at: ago(24 * 120) },
  { _id: 'CU-1008', name: 'Michael O.', email: 'michael.o@mail.co.za', phone: '079 555 0136', city: 'Sandton', at: ago(24 * 100) },
  { _id: 'CU-1009', name: 'Fatima R.', email: 'fatima.r@mail.co.za', phone: '081 555 0192', city: 'Durban', at: ago(24 * 80) },
  { _id: 'CU-1010', name: 'Sipho D.', email: 'sipho.d@mail.co.za', phone: '076 555 0108', city: 'Soweto', at: ago(24 * 60) },
  { _id: 'CU-1011', name: 'Grace M.', email: 'grace.m@mail.co.za', phone: '082 555 0175', city: 'Randburg', at: ago(24 * 40) },
];
const who = (name: string) => customers.find((c) => c.name === name)!;
const line = (id: string, qty = 1, variant = '') => {
  const p = products.find((x) => x._id === id)!;
  return { productId: id, name: p.name, variant, image: p.image, qty, unitPrice: p.price };
};

const orderSeed: [number, string, string, ReturnType<typeof line>[], string, number][] = [
  // [number, customer, status, items, payment, hoursAgo]
  [10482, 'Thabo N.', 'Delivered', [line('iphone-17-pro-max', 1, 'Deep Blue · 256GB · New')], 'card', 4],
  [10481, 'Aisha K.', 'Packed', [line('airpods-pro-3', 1, 'USB-C · New')], 'payflex', 9],
  [10480, 'Lerato M.', 'In transit', [line('galaxy-s25-ultra', 1, 'Black · 256GB · New')], 'card', 30],
  [10479, 'Juan P.', 'Pending payment', [line('macbook-air', 1, 'M4 · 256GB')], 'eft', 33],
  [10478, 'Naledi S.', 'Cancelled', [line('iphone-15-pro', 1, 'Natural · 128GB · Grade A')], 'card', 55],
  [10477, 'Kyle B.', 'Delivered', [line('galaxy-a36', 2, 'Black · 128GB · New')], 'card', 58],
  [10476, 'Zanele P.', 'In transit', [line('iphone-17', 1, 'Black · 128GB · New')], 'payflex', 80],
  [10475, 'Michael O.', 'Delivered', [line('airpods-pro-3', 1, 'USB-C · New')], 'eft', 84],
];

const repairSeed: [number, string, string, string, string, number, string, number][] = [
  [3391, 'Thabo N.', 'iPhone 15 Pro', 'Screen replacement', 'Today, 2pm', 1899, 'In progress', 3],
  [3390, 'Aisha K.', 'Galaxy S24', 'Battery swap', 'Today, 4pm', 899, 'Diagnosing', 5],
  [3389, 'Lerato M.', 'MacBook Air', 'Keyboard repair', 'Tomorrow, 10am', 2499, 'Waiting on part', 20],
  [3388, 'Juan P.', 'iPhone 13', 'Back glass', 'Yesterday', 1299, 'Ready to collect', 28],
  [3387, 'Naledi S.', 'iPad Air', 'Charging port', 'Yesterday', 749, 'Ready to collect', 30],
  [3386, 'Kyle B.', 'Galaxy S23', 'Cracked screen', '2 days ago', 1599, 'Quality check', 52],
];

const tradeInSeed: [number, string, string, 'A' | 'B' | 'C', number, number, string, number][] = [
  [2210, 'Zanele P.', 'iPhone 14 · 128GB', 'A', 9500, 10800, 'Awaiting check-in', 6],
  [2209, 'Michael O.', 'iPhone 13 · 256GB', 'B', 6200, 7100, 'Checked — credit issued', 26],
  [2208, 'Fatima R.', 'Galaxy S23 · 128GB', 'A', 5800, 6600, 'Awaiting check-in', 40],
  [2207, 'Sipho D.', 'iPhone 12 · 64GB', 'C', 2400, 2900, 'Declined — device faulty', 60],
  [2206, 'Grace M.', 'iPhone 14 Pro · 256GB', 'A', 11200, 12600, 'Checked — credit issued', 75],
];

/** Insert only when the id is missing, with an explicit creation date (so history looks real). */
async function put<T extends { _id: unknown }>(model: mongoose.Model<any>, doc: T, createdAt: Date) {
  await model.updateOne({ _id: doc._id }, { $setOnInsert: { ...doc, createdAt, updatedAt: createdAt } }, { upsert: true, timestamps: false });
}

async function main() {
  await connectDatabase();

  if (process.argv.includes('--reset')) {
    const all: mongoose.Model<any>[] = [ActivityLog, AdminUser, Counter, Customer, Message, Order, Product, Repair, Settings, Subscriber, TradeIn];
    await Promise.all(all.map((m) => m.deleteMany({})));
    console.log('[seed] existing data removed');
  }

  await Settings.updateOne({ _id: 'store' }, { $setOnInsert: { _id: 'store' } }, { upsert: true });

  await AdminUser.updateOne(
    { email: env.ADMIN_EMAIL.toLowerCase() },
    { $setOnInsert: { email: env.ADMIN_EMAIL.toLowerCase(), name: env.ADMIN_NAME, passwordHash: await hashPassword(env.ADMIN_PASSWORD), role: 'admin' } },
    { upsert: true },
  );

  for (const [i, p] of products.entries()) await put(Product, { ...p, active: true, position: i + 1 }, ago(24 * 90 - i));
  for (const { at, ...c } of customers) await put(Customer, c, at);

  for (const [n, name, status, items, payment, hours] of orderSeed) {
    const c = who(name);
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    await put(
      Order,
      {
        _id: `VE-${n}`,
        customer: c.name,
        email: c.email,
        phone: c.phone,
        items,
        subtotal,
        shipping: 0,
        total: subtotal,
        status,
        delivery: 'pickup',
        shippingMethod: 'pickup',
        payment,
        notes: '',
      },
      ago(hours),
    );
  }

  for (const [n, name, device, issue, when, quote, status, hours] of repairSeed) {
    const c = who(name);
    await put(Repair, { _id: `RP-${n}`, customer: c.name, email: c.email, phone: c.phone, device, issue, when, quote, status, method: 'Walk in / drop off', source: 'admin', notes: '' }, ago(hours));
  }

  for (const [n, name, device, grade, creditMin, creditMax, status, hours] of tradeInSeed) {
    const c = who(name);
    await put(TradeIn, { _id: `TI-${n}`, customer: c.name, email: c.email, phone: c.phone, device, grade, creditMin, creditMax, status, answers: { cracked: grade !== 'A', damage: grade === 'C', powers: grade !== 'C' } }, ago(hours));
  }

  if ((await ActivityLog.countDocuments()) === 0) {
    const entries: [string, 'order' | 'repair' | 'trade-in' | 'product', number][] = [
      ['Order VE-10482 marked Delivered', 'order', 4],
      ['Repair RP-3388 is ready to collect', 'repair', 20],
      ['Trade-in TI-2209 checked — credit issued', 'trade-in', 26],
      ['Stock updated for iPhone 15 Pro (2 left)', 'product', 32],
    ];
    for (const [text, kind, h] of entries) await ActivityLog.updateOne({ text }, { $setOnInsert: { text, kind, actor: 'Seed', createdAt: ago(h), updatedAt: ago(h) } }, { upsert: true, timestamps: false });
  }

  await ensureCounterAtLeast('order', 10482);
  await ensureCounterAtLeast('repair', 3391);
  await ensureCounterAtLeast('tradeIn', 2210);
  await ensureCounterAtLeast('customer', 1011);

  console.log(`[seed] done. Admin login: ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
  await disconnectDatabase();
}

main().catch(async (error) => {
  console.error('[seed] failed:', error instanceof Error ? error.message : error);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
