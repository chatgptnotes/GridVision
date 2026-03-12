import { Request, Response } from 'express';
import { alarmService } from '../services/alarm.service';
import type { AlarmPriority } from '@ampris/shared';

export async function getActiveAlarms(req: Request, res: Response): Promise<void> {
  const { priorities, limit, offset } = req.query;

  const filter = {
    priorities: priorities ? (priorities as string).split(',').map(Number) as AlarmPriority[] : undefined,
    limit: limit ? parseInt(limit as string) : 100,
    offset: offset ? parseInt(offset as string) : 0,
  };

  const alarms = await alarmService.getActiveAlarms(filter);
  res.json(alarms);
}

export async function getAlarmHistory(req: Request, res: Response): Promise<void> {
  const { startTime, endTime, limit, offset } = req.query;
  const { prisma } = await import('../config/database');

  const where: Record<string, unknown> = {};
  if (startTime) where.raisedAt = { gte: new Date(startTime as string) };
  if (endTime) {
    where.raisedAt = { ...((where.raisedAt as object) || {}), lte: new Date(endTime as string) };
  }

  const alarms = await prisma.alarmLog.findMany({
    where,
    include: {
      alarmDef: {
        include: {
          dataPoint: {
            include: {
              equipment: {
                select: { name: true, tag: true },
              },
            },
          },
        },
      },
    },
    orderBy: { raisedAt: 'desc' },
    take: parseInt((limit as string) || '100'),
    skip: parseInt((offset as string) || '0'),
  });

  res.json(alarms);
}

export async function acknowledgeAlarm(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await alarmService.acknowledgeAlarm(id, req.user!.userId);
    res.json({ message: 'Alarm acknowledged' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to acknowledge alarm';
    res.status(400).json({ error: message });
  }
}

export async function shelveAlarm(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { durationMinutes } = req.body;
    await alarmService.shelveAlarm(id, durationMinutes || 30);
    res.json({ message: 'Alarm shelved' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to shelve alarm';
    res.status(400).json({ error: message });
  }
}

export async function getAlarmSummary(_req: Request, res: Response): Promise<void> {
  const summary = await alarmService.getAlarmSummary();
  res.json(summary);
}
