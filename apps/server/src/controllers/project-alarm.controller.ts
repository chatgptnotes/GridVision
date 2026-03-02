import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { alarmEngine } from '../services/alarm-engine.service';

// CRUD for ProjectAlarmDefinition
export async function getDefinitions(req: Request, res: Response): Promise<void> {
  const { projectId } = req.query;
  const where: any = {};
  if (projectId) where.projectId = projectId;
  const defs = await prisma.projectAlarmDefinition.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(defs);
}

export async function createDefinition(req: Request, res: Response): Promise<void> {
  const def = await prisma.projectAlarmDefinition.create({ data: req.body });
  await alarmEngine.loadDefinitions();
  res.status(201).json(def);
}

export async function updateDefinition(req: Request, res: Response): Promise<void> {
  const def = await prisma.projectAlarmDefinition.update({
    where: { id: req.params.id },
    data: req.body,
  });
  await alarmEngine.loadDefinitions();
  res.json(def);
}

export async function deleteDefinition(req: Request, res: Response): Promise<void> {
  await prisma.projectAlarmDefinition.delete({ where: { id: req.params.id } });
  await alarmEngine.loadDefinitions();
  res.json({ message: 'Deleted' });
}

// Active alarms
export async function getActiveAlarms(req: Request, res: Response): Promise<void> {
  const { projectId } = req.query;
  const where: any = {};
  if (projectId) where.projectId = projectId;
  const alarms = await prisma.projectActiveAlarm.findMany({
    where,
    orderBy: [{ severity: 'desc' }, { activatedAt: 'desc' }],
  });
  res.json(alarms);
}

// Acknowledge
export async function acknowledgeAlarm(req: Request, res: Response): Promise<void> {
  try {
    await alarmEngine.acknowledge(req.params.id, req.user?.userId || 'unknown', req.body.comment);
    res.json({ message: 'Acknowledged' });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

// Acknowledge all
export async function acknowledgeAllAlarms(req: Request, res: Response): Promise<void> {
  const count = await alarmEngine.acknowledgeAll(req.body.projectId);
  res.json({ message: `Acknowledged ${count} alarms`, count });
}

// Shelve
export async function shelveAlarm(req: Request, res: Response): Promise<void> {
  await alarmEngine.shelve(req.params.id, req.body.minutes || 30, req.user?.userId || 'unknown');
  res.json({ message: 'Shelved' });
}

// Unshelve
export async function unshelveAlarm(req: Request, res: Response): Promise<void> {
  await alarmEngine.unshelve(req.params.id);
  res.json({ message: 'Unshelved' });
}

// Suppress
export async function suppressAlarm(req: Request, res: Response): Promise<void> {
  await alarmEngine.suppress(req.params.id, req.user?.userId || 'unknown');
  res.json({ message: 'Suppressed' });
}

// Summary
export async function getAlarmSummary(req: Request, res: Response): Promise<void> {
  const { projectId } = req.query;
  const where: any = {};
  if (projectId) where.projectId = projectId;

  const alarms = await prisma.projectActiveAlarm.findMany({ where });
  const summary = {
    total: alarms.length,
    bySeverity: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
    byState: { ACTIVE_UNACK: 0, ACTIVE_ACK: 0, CLEARED_UNACK: 0 } as Record<string, number>,
  };
  for (const a of alarms) {
    summary.bySeverity[a.severity] = (summary.bySeverity[a.severity] || 0) + 1;
    summary.byState[a.state] = (summary.byState[a.state] || 0) + 1;
  }
  res.json(summary);
}

// History (returns cleared alarms from active table + current)
export async function getAlarmHistory(req: Request, res: Response): Promise<void> {
  const { from, to, projectId } = req.query;
  const where: any = {};
  if (projectId) where.projectId = projectId;
  if (from || to) {
    where.activatedAt = {};
    if (from) where.activatedAt.gte = new Date(from as string);
    if (to) where.activatedAt.lte = new Date(to as string);
  }
  const alarms = await prisma.projectActiveAlarm.findMany({
    where,
    orderBy: { activatedAt: 'desc' },
    take: 500,
  });
  res.json(alarms);
}
