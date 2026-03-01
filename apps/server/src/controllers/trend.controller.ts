import { Request, Response } from 'express';
import { historianService } from '../services/historian.service';
import type { TrendResolution } from '@gridvision/shared';

export async function getTrend(req: Request, res: Response): Promise<void> {
  try {
    const { dataPointIds, startTime, endTime, resolution } = req.query;

    if (!dataPointIds || !startTime || !endTime) {
      res.status(400).json({ error: 'dataPointIds, startTime, and endTime are required' });
      return;
    }

    const ids = (dataPointIds as string).split(',');
    if (ids.length > 8) {
      res.status(400).json({ error: 'Maximum 8 data points per trend query' });
      return;
    }

    const data = await historianService.queryTrend({
      dataPointIds: ids,
      startTime: new Date(startTime as string),
      endTime: new Date(endTime as string),
      resolution: resolution as TrendResolution | undefined,
    });

    res.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Trend query failed';
    res.status(500).json({ error: message });
  }
}

export async function getSOEEvents(req: Request, res: Response): Promise<void> {
  try {
    const { startTime, endTime, substationId, limit } = req.query;

    if (!startTime || !endTime) {
      res.status(400).json({ error: 'startTime and endTime are required' });
      return;
    }

    const events = await historianService.getSOEEvents(
      new Date(startTime as string),
      new Date(endTime as string),
      substationId as string | undefined,
      limit ? parseInt(limit as string) : 500,
    );

    res.json(events);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'SOE query failed';
    res.status(500).json({ error: message });
  }
}
