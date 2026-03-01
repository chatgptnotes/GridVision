import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import type { TokenPayload } from '@gridvision/shared';

export function setupSocketAuth(io: SocketIOServer): void {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      (socket as Socket & { user: TokenPayload }).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });
}

export function setupSocketHandlers(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    const user = (socket as Socket & { user?: TokenPayload }).user;
    console.log(`Socket connected: ${socket.id} (user: ${user?.username || 'unknown'})`);

    socket.on('subscribe:substation', (substationId: string) => {
      socket.join(`substation:${substationId}`);
    });

    socket.on('unsubscribe:substation', (substationId: string) => {
      socket.leave(`substation:${substationId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id} (reason: ${reason})`);
    });
  });
}
