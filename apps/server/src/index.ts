import { createServer } from 'http';
import app from './app';
import { env } from './config/environment';
import { connectDatabase, disconnectDatabase } from './config/database';
import { realtimeService } from './services/realtime.service';
import { alarmService } from './services/alarm.service';
import { tagEngine } from './services/tag-engine.service';
import { initML } from './ml';
import { alarmEngine } from './services/alarm-engine.service';

async function main(): Promise<void> {
  console.log('Starting Ampris SCADA Server...');

  // Connect to database
  await connectDatabase();

  // Initialize alarm engine
  await alarmService.initialize();

  // Create HTTP server
  const httpServer = createServer(app);

  // Initialize WebSocket / real-time service
  realtimeService.initialize(httpServer);

  // Start the simulator — begins generating data immediately
  realtimeService.startSimulator();

  // Initialize tag engine (internal/simulated/calculated tags)
  await tagEngine.initialize();

  // Initialize project alarm engine
  await alarmEngine.initialize();

  // Initialize ML engine (load models or train if needed)
  initML().catch(err => console.error('ML init error (non-fatal):', err));

  // Start HTTP server
  httpServer.listen(env.PORT, () => {
    console.log(`Ampris SCADA Server running on port ${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`API: http://localhost:${env.PORT}/api`);
    console.log(`Health: http://localhost:${env.PORT}/api/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    httpServer.close(async () => {
      await disconnectDatabase();
      console.log('Server closed.');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Prevent unhandled promise rejections / exceptions from killing the server
process.on('unhandledRejection', (reason) => {
  console.error('[WARN] Unhandled promise rejection (not crashing):', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[WARN] Uncaught exception (not crashing):', err.message);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
