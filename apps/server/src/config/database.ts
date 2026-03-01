import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { env } from './environment';

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  redis.disconnect();
}
