import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { redis } from '../config/database';
import { env } from '../config/environment';
import { alarmService } from './alarm.service';
import { historianService } from './historian.service';
import type { RealTimeValue } from '@gridvision/shared';

export class RealtimeService {
  private io!: SocketIOServer;
  private subscriber = redis.duplicate();
  private currentValues: Map<string, RealTimeValue> = new Map();

  initialize(httpServer: HttpServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Send current snapshot on connect
      socket.emit('snapshot', Object.fromEntries(this.currentValues));

      socket.on('subscribe:substation', (substationId: string) => {
        socket.join(`substation:${substationId}`);
      });

      socket.on('unsubscribe:substation', (substationId: string) => {
        socket.leave(`substation:${substationId}`);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    this.subscribeToRedis();
    console.log('WebSocket server initialized');
  }

  private subscribeToRedis(): void {
    this.subscriber.subscribe('alarms:raised', 'alarms:cleared', 'alarms:acknowledged', 'alarms:shelved');

    this.subscriber.on('message', (channel: string, message: string) => {
      try {
        const data = JSON.parse(message);
        switch (channel) {
          case 'alarms:raised':
            this.io.emit('alarm:raised', data);
            break;
          case 'alarms:cleared':
            this.io.emit('alarm:cleared', data);
            break;
          case 'alarms:acknowledged':
            this.io.emit('alarm:acknowledged', data);
            break;
          case 'alarms:shelved':
            this.io.emit('alarm:shelved', data);
            break;
        }
      } catch (err) {
        console.error('Redis message parse error:', err);
      }
    });
  }

  async publishMeasurement(tag: string, dataPointId: string, value: number, quality: number = 0): Promise<void> {
    const rtValue: RealTimeValue = {
      tag,
      value,
      quality,
      timestamp: new Date(),
    };

    this.currentValues.set(tag, rtValue);
    this.io.emit('measurement', rtValue);

    // Store in historian
    await historianService.recordMeasurement(dataPointId, value, quality);

    // Evaluate alarms
    await alarmService.evaluateAnalog(dataPointId, value);
  }

  async publishDigitalState(tag: string, dataPointId: string, state: boolean, quality: number = 0): Promise<void> {
    const previousValue = this.currentValues.get(tag);
    const previousState = previousValue ? Boolean(previousValue.value) : undefined;

    const rtValue: RealTimeValue = {
      tag,
      value: state,
      quality,
      timestamp: new Date(),
    };

    this.currentValues.set(tag, rtValue);
    this.io.emit('digital_state', rtValue);

    // Store in historian
    await historianService.recordDigitalState(dataPointId, state, quality);

    // Evaluate alarms
    await alarmService.evaluateDigital(dataPointId, state, previousState);

    // Log SOE if state changed
    if (previousState !== undefined && previousState !== state) {
      await historianService.recordSOEEvent(
        dataPointId,
        previousState ? 'CLOSED' : 'OPEN',
        state ? 'CLOSED' : 'OPEN',
      );
    }
  }

  getCurrentValue(tag: string): RealTimeValue | undefined {
    return this.currentValues.get(tag);
  }

  getAllCurrentValues(): Record<string, RealTimeValue> {
    return Object.fromEntries(this.currentValues);
  }

  getIO(): SocketIOServer {
    return this.io;
  }
}

export const realtimeService = new RealtimeService();
