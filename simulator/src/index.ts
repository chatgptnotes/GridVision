import Redis from 'ioredis';
import { Substation33_11Simulator } from './substation-33-11';
import { Substation132_33Simulator } from './substation-132-33';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '2000', 10);

async function main() {
  console.log('Starting GridVision SCADA Data Simulator...');

  const redis = new Redis(REDIS_URL);

  redis.on('error', (err) => {
    console.error('Redis error:', err.message);
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });

  // Initialize simulators
  const simulators = [
    new Substation33_11Simulator('WALUJ', 6),
    new Substation33_11Simulator('CIDCO', 5),
    new Substation132_33Simulator('PARBHANI', 30),
  ];

  console.log(`Simulating ${simulators.length} substations every ${POLL_INTERVAL}ms`);

  // Simulation loop
  setInterval(async () => {
    for (const sim of simulators) {
      const points = sim.generate();

      for (const point of points) {
        const payload = JSON.stringify({
          tag: point.tag,
          value: point.value,
          quality: 0,
          timestamp: new Date().toISOString(),
        });

        if (point.type === 'analog') {
          await redis.publish('measurements:update', payload);
        } else {
          await redis.publish('digital:update', payload);
        }

        // Also store in Redis hash for snapshot
        await redis.hset('scada:current', point.tag, payload);
      }
    }
  }, POLL_INTERVAL);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down simulator...');
    redis.disconnect();
    process.exit(0);
  });

  console.log('Simulator running. Press Ctrl+C to stop.');
}

main().catch((err) => {
  console.error('Simulator failed:', err);
  process.exit(1);
});
