import { Server as SocketIOServer } from 'socket.io';
import { redis } from '../config/database';

/** Map Redis channel names to client-side WebSocket event names */
const channelToEvent: Record<string, string> = {
  'alarms:raised': 'alarm:raised',
  'alarms:cleared': 'alarm:cleared',
  'alarms:acknowledged': 'alarm:acknowledged',
  'alarms:shelved': 'alarm:shelved',
  'measurements:update': 'measurement',
  'digital:update': 'digital_state',
};

export function setupRedisSubscriptions(io: SocketIOServer): void {
  const subscriber = redis.duplicate();

  subscriber.subscribe(
    ...Object.keys(channelToEvent),
  );

  subscriber.on('message', (channel: string, message: string) => {
    try {
      const data = JSON.parse(message);
      const event = channelToEvent[channel] || channel;
      io.emit(event, data);
    } catch (err) {
      console.error(`Failed to process Redis message on ${channel}:`, err);
    }
  });
}
