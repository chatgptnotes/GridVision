import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { realtimeService } from '../services/realtime.service';

export async function getSubstations(_req: Request, res: Response): Promise<void> {
  const substations = await prisma.substation.findMany({
    include: {
      voltageLevels: {
        include: {
          bays: {
            include: {
              equipment: { select: { id: true, tag: true, type: true, name: true } },
            },
          },
        },
      },
      iedConnections: { select: { id: true, name: true, protocol: true, status: true } },
    },
    orderBy: { name: 'asc' },
  });
  res.json(substations);
}

export async function getSubstationById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const substation = await prisma.substation.findUnique({
    where: { id },
    include: {
      voltageLevels: {
        include: {
          bays: {
            include: {
              equipment: {
                include: {
                  dataPoints: true,
                },
              },
            },
          },
        },
      },
      iedConnections: true,
    },
  });

  if (!substation) {
    res.status(404).json({ error: 'Substation not found' });
    return;
  }

  res.json(substation);
}

export async function getSubstationRealtime(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const substation = await prisma.substation.findUnique({
    where: { id },
    include: {
      voltageLevels: {
        include: {
          bays: {
            include: {
              equipment: {
                include: { dataPoints: { select: { tag: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!substation) {
    res.status(404).json({ error: 'Substation not found' });
    return;
  }

  // Collect all tags and their current values
  const values: Record<string, unknown> = {};
  for (const vl of substation.voltageLevels) {
    for (const bay of vl.bays) {
      for (const equip of bay.equipment) {
        for (const dp of equip.dataPoints) {
          const val = realtimeService.getCurrentValue(dp.tag);
          if (val) {
            values[dp.tag] = val;
          }
        }
      }
    }
  }

  res.json({ substationId: id, timestamp: new Date(), values });
}

export async function getEquipmentBySubstation(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const equipment = await prisma.equipment.findMany({
    where: {
      bay: { voltageLevel: { substationId: id } },
    },
    include: {
      dataPoints: true,
      bay: {
        include: { voltageLevel: true },
      },
    },
    orderBy: [{ bay: { voltageLevel: { nominalKv: 'desc' } } }, { bay: { bayNumber: 'asc' } }],
  });

  res.json(equipment);
}

export async function getDataPoints(req: Request, res: Response): Promise<void> {
  const { substationId } = req.query;
  const where = substationId
    ? { equipment: { bay: { voltageLevel: { substationId: substationId as string } } } }
    : {};

  const dataPoints = await prisma.dataPoint.findMany({
    where,
    include: {
      equipment: {
        select: { tag: true, name: true, type: true },
      },
    },
    orderBy: { tag: 'asc' },
  });

  res.json(dataPoints);
}
