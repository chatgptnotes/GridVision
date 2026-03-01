import { Request, Response } from 'express';
import { reportService } from '../services/report.service';

export async function getDailyLoadReport(req: Request, res: Response): Promise<void> {
  try {
    const { substationId, date } = req.query;
    if (!substationId || !date) {
      res.status(400).json({ error: 'substationId and date are required' });
      return;
    }

    const report = await reportService.generateDailyLoadReport(
      substationId as string,
      new Date(date as string),
    );

    res.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Report generation failed';
    res.status(500).json({ error: message });
  }
}

export async function getAlarmSummaryReport(req: Request, res: Response): Promise<void> {
  try {
    const { startTime, endTime, substationId } = req.query;
    if (!startTime || !endTime) {
      res.status(400).json({ error: 'startTime and endTime are required' });
      return;
    }

    const report = await reportService.generateAlarmSummaryReport(
      new Date(startTime as string),
      new Date(endTime as string),
      substationId as string | undefined,
    );

    res.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Report generation failed';
    res.status(500).json({ error: message });
  }
}

export async function getAuditTrail(req: Request, res: Response): Promise<void> {
  const { prisma } = await import('../config/database');
  const { userId, action, startTime, endTime, limit } = req.query;

  const where: Record<string, unknown> = {};
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (startTime || endTime) {
    where.timestamp = {};
    if (startTime) (where.timestamp as Record<string, unknown>).gte = new Date(startTime as string);
    if (endTime) (where.timestamp as Record<string, unknown>).lte = new Date(endTime as string);
  }

  const trail = await prisma.auditTrail.findMany({
    where,
    include: { user: { select: { name: true, username: true } } },
    orderBy: { timestamp: 'desc' },
    take: parseInt((limit as string) || '100'),
  });

  res.json(trail);
}
