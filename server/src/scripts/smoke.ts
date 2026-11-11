/** Quick API check that needs no database: routing, validation, auth and CORS.   npm run smoke */
import { createApp } from '../app';
import { signToken } from '../services/auth.service';

async function main() {
  const server = createApp().listen(0);
  const port = (server.address() as { port: number }).port;
  const base = `http://127.0.0.1:${port}/api`;
  const call = async (label: string, path: string, init: RequestInit = {}) => {
    const res = await fetch(base + path, init);
    const body = await res.text();
    console.log(`${String(res.status).padEnd(4)} ${label.padEnd(44)} ${body.slice(0, 110)}`);
    return res;
  };
  const json = (b: unknown, h: Record<string, string> = {}): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json', ...h }, body: JSON.stringify(b) });
  const token = signToken({ sub: '000000000000000000000001', email: 'a@b.co', name: 'Test', role: 'admin' });
  const auth = { Authorization: `Bearer ${token}` };

  await call('health', '/health');
  await call('unknown route -> 404', '/nope');
  await call('login bad body -> 400', '/auth/login', json({ email: 'x' }));
  await call('admin bootstrap, no token -> 401', '/admin/bootstrap');
  await call('admin bootstrap, bad token -> 401', '/admin/bootstrap', { headers: { Authorization: 'Bearer nonsense' } });
  await call('admin product invalid, valid token -> 400', '/admin/products', json({ name: '' }, auth));
  await call('admin order status invalid -> 400', '/admin/orders/VE-1/status', { ...json({ status: 'Teleported' }, auth), method: 'PATCH' });
  await call('checkout empty cart -> 400', '/store/orders', json({ items: [] }));
  await call('checkout pickup no phone -> 400', '/store/orders', json({ items: [{ productId: 'x', qty: 1 }], contact: { email: 'a@b.co', firstName: 'A', lastName: 'B' }, delivery: 'pickup', payment: 'card' }));
  await call('checkout ship, no address -> 400', '/store/orders', json({ items: [{ productId: 'x', qty: 1 }], contact: { email: 'a@b.co', phone: '0821234567', firstName: 'A', lastName: 'B' }, delivery: 'ship', payment: 'card' }));
  await call('repair booking bad email -> 400', '/store/repairs', json({ name: 'A', email: 'nope', phone: '082', device: 'x', issues: ['x'], method: 'x', when: 'x' }));
  await call('track missing params -> 400', '/store/track');
  const est = await call('trade-in estimate (no DB needed)', '/store/trade-ins/estimate', json({ model: 'iPhone 15 Pro', storage: '256GB', answers: { cracked: false, damage: false, powers: true } }));
  await call('trade-in estimate grade B', '/store/trade-ins/estimate', json({ model: 'iPhone 15 Pro', storage: '256GB', answers: { cracked: true, damage: false, powers: true } }));
  await call('trade-in estimate grade C', '/store/trade-ins/estimate', json({ model: 'Other', storage: '128GB', answers: { cracked: true, damage: true, powers: false } }));
  const cors = await fetch(base + '/health', { headers: { Origin: 'http://localhost:3000' } });
  console.log('CORS allow-origin for :3000   ->', cors.headers.get('access-control-allow-origin'));
  const evil = await fetch(base + '/health', { headers: { Origin: 'http://evil.example' } });
  console.log('CORS allow-origin for evil    ->', evil.headers.get('access-control-allow-origin'));
  void est;
  server.close();
}
main();
