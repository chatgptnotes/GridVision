import { prisma } from '../config/database';

export interface DailyLoadReport {
  date: string;
  substationName: string;
  feeders: Array<{
    name: string;
    tag: string;
    maxLoad: number;
    minLoad: number;
    avgLoad: number;
    peakTime: string;
    energyKwh: number;
  }>;
  totalMaxLoad: number;
  totalEnergy: number;
}

export interface AlarmSummaryReport {
  period: { start: Date; end: Date };
  totalAlarms: number;
  byPriority: Array<{ priority: number; count: number }>;
  byType: Array<{ type: string; count: number }>;
  topAlarming: Array<{ tag: string; name: string; count: number }>;
  avgResponseTime: number;
}

export class ReportService {
  async generateDailyLoadReport(substationId: string, date: Date): Promise<DailyLoadReport> {
    const substation = await prisma.substation.findUnique({ where: { id: substationId } });
    if (!substation) throw new Error('Substation not found');

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get feeder data points for active power
    const feederPoints = await prisma.dataPoint.findMany({
      where: {
        tag: { contains: '_P_3PH' },
        equipment: {
          bay: {
            bayType: 'FEEDER',
            voltageLevel: { substationId },
          },
        },
      },
      include: { equipment: { include: { bay: true } } },
    });

    const feeders = [];
    let totalMaxLoad = 0;
    let totalEnergy = 0;

    for (const dp of feederPoints) {
      const stats = await prisma.$queryRawUnsafe<Array<{
        max_value: number;
        min_value: number;
        avg_value: number;
        peak_time: Date;
      }>>(
        `SELECT MAX(value) as max_value, MIN(value) as min_value, AVG(value) as avg_value,
                (SELECT "timestamp" FROM tag_history WHERE tag_id = $1::uuid AND "timestamp" >= $2 AND "timestamp" <= $3 ORDER BY value DESC LIMIT 1) as peak_time
         FROM tag_history
         WHERE tag_id = $1::uuid AND "timestamp" >= $2 AND "timestamp" <= $3`,
        dp.id,
        startOfDay,
        endOfDay,
      );

      const stat = stats[0] || { max_value: 0, min_value: 0, avg_value: 0, peak_time: new Date() };
      const energyKwh = Number(stat.avg_value) * 24 * 1000; // MW * hours * 1000

      feeders.push({
        name: dp.equipment.bay.name,
        tag: dp.tag,
        maxLoad: Number(stat.max_value),
        minLoad: Number(stat.min_value),
        avgLoad: Number(stat.avg_value),
        peakTime: stat.peak_time?.toISOString() || '',
        energyKwh,
      });

      totalMaxLoad += Number(stat.max_value);
      totalEnergy += energyKwh;
    }

    return {
      date: date.toISOString().split('T')[0],
      substationName: substation.name,
      feeders,
      totalMaxLoad,
      totalEnergy,
    };
  }

  async generateAlarmSummaryReport(startTime: Date, endTime: Date, substationId?: string): Promise<AlarmSummaryReport> {
    const where: Record<string, unknown> = {
      raisedAt: { gte: startTime, lte: endTime },
    };

    const totalAlarms = await prisma.alarmLog.count({ where });

    const byPriority = await prisma.alarmLog.groupBy({
      by: ['priority'],
      where,
      _count: true,
      orderBy: { priority: 'asc' },
    });

    const byType = await prisma.$queryRawUnsafe<Array<{ alarm_type: string; count: string }>>(
      `SELECT ad.alarm_type, COUNT(*)::text as count
       FROM alarm_log al
       JOIN alarm_definitions ad ON al.alarm_def_id = ad.id
       WHERE al.raised_at >= $1 AND al.raised_at <= $2
       GROUP BY ad.alarm_type
       ORDER BY count DESC`,
      startTime,
      endTime,
    );

    const topAlarming = await prisma.$queryRawUnsafe<Array<{ tag: string; name: string; count: string }>>(
      `SELECT dp.tag, dp.name, COUNT(*)::text as count
       FROM alarm_log al
       JOIN alarm_definitions ad ON al.alarm_def_id = ad.id
       JOIN data_points dp ON ad.data_point_id = dp.id
       WHERE al.raised_at >= $1 AND al.raised_at <= $2
       GROUP BY dp.tag, dp.name
       ORDER BY count DESC
       LIMIT 10`,
      startTime,
      endTime,
    );

    return {
      period: { start: startTime, end: endTime },
      totalAlarms,
      byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count })),
      byType: byType.map((t) => ({ type: t.alarm_type, count: parseInt(t.count) })),
      topAlarming: topAlarming.map((t) => ({ tag: t.tag, name: t.name, count: parseInt(t.count) })),
      avgResponseTime: 0,
    };
  }
}

export const reportService = new ReportService();
