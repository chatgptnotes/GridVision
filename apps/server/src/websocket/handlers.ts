import { Server as SocketIOServer } from 'socket.io';
import { redis } from '../config/database';

export function setupRedisSubscriptions(io: SocketIOServer): void {
  const subscriber = redis.duplicate();

  subscriber.subscribe(
    'alarms:raised',
    'alarms:cleared',
    'alarms:acknowledged',
    'alarms:shelved',
    'measurements:update',
    'digital:update',
  );

  subscriber.on('message', (channel: string, message: string) => {
    try {
      const data = JSON.parse(message);
      io.emit(channel, data);
    } catch (err) {
      console.error(`Failed to process Redis message on ${channel}:`, err);
    }
  });
}
