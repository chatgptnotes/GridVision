import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { tagEngine } from '../services/tag-engine.service';

// CRUD for TrendConfig
export async function getTrendConfigs(req: Request, res: Response): Promise<void> {
  const { projectId } = req.query;
  const where: any = {};
  if (projectId) where.projectId = projectId;
  const configs = await prisma.trendConfig.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(configs);
}

export async function createTrendConfig(req: Request, res: Response): Promise<void> {
  const config = await prisma.trendConfig.create({ data: req.body });
  res.status(201).json(config);
}

export async function updateTrendConfig(req: Request, res: Response): Promise<void> {
  const config = await prisma.trendConfig.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(config);
}

export async function deleteTrendConfig(req: Request, res: Response): Promise<void> {
  await prisma.trendConfig.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
}

// Historical trend data
export async function getTrendData(req: Request, res: Response): Promise<void> {
  const { tags, from, to, points } = req.query;
  if (!tags) { res.json([]); return; }

  const tagNames = (tags as string).split(',');
  const maxPoints = parseInt(points as string) || 500;
  const fromDate = from ? new Date(from as string) : new Date(Date.now() - 3600000);
  const toDate = to ? new Date(to as string) : new Date();

  const data = await prisma.tagHistory.findMany({
    where: {
      tagName: { in: tagNames },
      timestamp: { gte: fromDate, lte: toDate },
    },
    orderBy: { timestamp: 'asc' },
    take: maxPoints * tagNames.length,
  });

  // Group by tag
  const grouped: Record<string, { timestamp: string; value: number }[]> = {};
  for (const tagName of tagNames) grouped[tagName] = [];
  for (const d of data) {
    if (!grouped[d.tagName]) grouped[d.tagName] = [];
    grouped[d.tagName].push({ timestamp: d.timestamp.toISOString(), value: d.value });
  }

  // Downsample each tag to maxPoints
  for (const tagName of Object.keys(grouped)) {
    const arr = grouped[tagName];
    if (arr.length > maxPoints) {
      const step = arr.length / maxPoints;
      const sampled = [];
      for (let i = 0; i < maxPoints; i++) {
        sampled.push(arr[Math.floor(i * step)]);
      }
      grouped[tagName] = sampled;
    }
  }

  res.json(grouped);
}

// Realtime data (last N seconds from tag engine history)
export async function getRealtimeData(req: Request, res: Response): Promise<void> {
  const { tags, window: windowSec } = req.query;
  if (!tags) { res.json({}); return; }

  const tagNames = (tags as string).split(',');
  const w = parseInt(windowSec as string) || 60;
  const cutoff = Date.now() - w * 1000;

  const result: Record<string, { timestamp: string; value: string }[]> = {};
  for (const tagName of tagNames) {
    const history = tagEngine.getTagHistory(tagName);
    result[tagName] = history
      .filter(h => h.timestamp.getTime() > cutoff)
      .map(h => ({ timestamp: h.timestamp.toISOString(), value: h.value }));
  }
  res.json(result);
}
