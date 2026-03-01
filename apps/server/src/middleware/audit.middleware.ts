import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export function auditLog(action: string, targetType?: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Log after response is sent
    const originalEnd = _res.end;
    const chunks: Buffer[] = [];

    _res.end = function (chunk?: unknown, ...args: unknown[]) {
      if (chunk) chunks.push(Buffer.from(chunk as string));

      // Fire-and-forget audit logging
      prisma.auditTrail
        .create({
          data: {
            userId: req.user?.userId,
            action,
            targetType: targetType || undefined,
            targetId: req.params.id || undefined,
            details: {
              method: req.method,
              path: req.path,
              statusCode: _res.statusCode,
              body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
            } as Record<string, unknown> as any,
            ipAddress: (req.ip || req.socket.remoteAddress || '').replace('::ffff:', ''),
          },
        })
        .catch((err) => {
          console.error('Audit log error:', err.message);
        });

      return originalEnd.apply(_res, [chunk, ...args] as never);
    } as typeof originalEnd;

    next();
  };
}

function sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
  if (!body) return {};
  const sanitized = { ...body };
  const sensitiveKeys = ['password', 'token', 'secret', 'passwordHash'];
  for (const key of sensitiveKeys) {
    if (key in sanitized) {
      sanitized[key] = '***REDACTED***';
    }
  }
  return sanitized;
}
