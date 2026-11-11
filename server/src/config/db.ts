import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env';

/** Some networks time out on the DNS lookups behind `mongodb+srv://`; optionally use other resolvers. */
function configureDns() {
  dns.setDefaultResultOrder('ipv4first');
  const servers = env.DNS_SERVERS.split(',').map((s) => s.trim()).filter(Boolean);
  if (servers.length > 0) dns.setServers(servers);
}

const ATTEMPTS = 3;

export async function connectDatabase(): Promise<void> {
  configureDns();
  mongoose.set('strictQuery', true);

  for (let attempt = 1; ; attempt++) {
    try {
      await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
      break;
    } catch (error) {
      if (attempt >= ATTEMPTS) throw error;
      console.warn(`[db] connection attempt ${attempt}/${ATTEMPTS} failed (${error instanceof Error ? error.message : error}), retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  const { host, name } = mongoose.connection;
  console.log(`[db] connected to ${name} on ${host}`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
