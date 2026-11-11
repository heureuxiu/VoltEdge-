import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/db';
import { env } from './config/env';

async function main() {
  await connectDatabase();
  const server = createApp().listen(env.PORT, () => {
    console.log(`[server] http://localhost:${env.PORT}/api  (${env.NODE_ENV})`);
  });

  const shutdown = (signal: string) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error) => {
  console.error('[server] failed to start:', error instanceof Error ? error.message : error);
  process.exit(1);
});
