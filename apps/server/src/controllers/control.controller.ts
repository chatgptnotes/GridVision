import { Request, Response } from 'express';
import { controlService } from '../services/control.service';
import type { CommandType } from '@ampris/shared';

export async function selectControl(req: Request, res: Response): Promise<void> {
  try {
    const { equipmentId, commandType } = req.body;

    if (!equipmentId || !commandType) {
      res.status(400).json({ error: 'equipmentId and commandType are required' });
      return;
    }

    const result = await controlService.select(
      { equipmentId, commandType: commandType as CommandType },
      req.user!.userId,
    );

    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Control select failed';
    res.status(400).json({ error: message });
  }
}

export async function executeControl(req: Request, res: Response): Promise<void> {
  try {
    const { commandId } = req.body;

    if (!commandId) {
      res.status(400).json({ error: 'commandId is required' });
      return;
    }

    const result = await controlService.execute(commandId, req.user!.userId);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Control execute failed';
    res.status(400).json({ error: message });
  }
}

export async function cancelControl(req: Request, res: Response): Promise<void> {
  try {
    const { commandId } = req.body;

    if (!commandId) {
      res.status(400).json({ error: 'commandId is required' });
      return;
    }

    await controlService.cancel(commandId, req.user!.userId);
    res.json({ message: 'Command cancelled' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cancel failed';
    res.status(400).json({ error: message });
  }
}

export async function getControlHistory(req: Request, res: Response): Promise<void> {
  const { prisma } = await import('../config/database');
  const { equipmentId, limit } = req.query;

  const where: Record<string, unknown> = {};
  if (equipmentId) where.equipmentId = equipmentId;

  const commands = await prisma.controlCommand.findMany({
    where,
    include: {
      equipment: { select: { tag: true, name: true } },
      user: { select: { name: true, username: true } },
    },
    orderBy: { initiatedAt: 'desc' },
    take: parseInt((limit as string) || '50'),
  });

  res.json(commands);
}
