import Redis from 'ioredis';
import { config } from './index.js';

export const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null, // Required for BullMQ compatibility
  enableReadyCheck: false,
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export const connectRedis = async (): Promise<void> => {
  // Redis connects automatically, just verify it's ready
  return new Promise((resolve, reject) => {
    if (redis.status === 'ready') {
      resolve();
      return;
    }
    
    redis.once('ready', () => {
      resolve();
    });
    
    redis.once('error', (err) => {
      reject(err);
    });
  });
};
