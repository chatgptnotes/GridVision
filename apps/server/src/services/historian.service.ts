import { prisma } from '../config/database';
import type { TrendQuery, TrendData, TrendResolution } from '@gridvision/shared';

export class HistorianService {
  async recordMeasurement(dataPointId: string, value: number, quality: number = 0): Promise<void> {
    await prisma.$executeRawUnsafe(
      `INSERT INTO measurements (time, data_point_id, value, quality) VALUES (NOW(), $1::uuid, $2, $3)`,
      dataPointId,
      value,
      quality,
    );
  }

  async recordDigitalState(dataPointId: string, state: boolean, quality: number = 0): Promise<void> {
    await prisma.$executeRawUnsafe(
      `INSERT INTO digital_states (time, data_point_id, state, quality) VALUES (NOW(), $1::uuid, $2, $3)`,
      dataPointId,
      state,
      quality,
    );
  }

  async recordSOEEvent(dataPointId: string, oldState: string, newState: string, cause?: string): Promise<void> {
    await prisma.$executeRawUnsafe(
      `INSERT INTO soe_events (time, data_point_id, old_state, new_state, cause) VALUES (NOW(), $1::uuid, $2, $3, $4)`,
      dataPointId,
      oldState,
      newState,
      cause || null,
    );
  }

  async queryTrend(query: TrendQuery): Promise<TrendData[]> {
    const resolution = query.resolution || this.autoResolution(query.startTime, query.endTime);
    const results: TrendData[] = [];

    for (const dpId of query.dataPointIds) {
      const dataPoint = await prisma.dataPoint.findUnique({
        where: { id: dpId },
        select: { tag: true, unit: true },
      });

      if (!dataPoint) continue;

      let points: Array<{ bucket: Date; avg_value: number; min_value: number; max_value: number }>;

      if (resolution === 'raw') {
        const raw = await prisma.$queryRawUnsafe<Array<{ time: Date; value: number }>>(
          `SELECT time, value FROM measurements WHERE data_point_id = $1::uuid AND time >= $2 AND time <= $3 ORDER BY time`,
          dpId,
          query.startTime,
          query.endTime,
        );
        points = raw.map((r) => ({
          bucket: r.time,
          avg_value: r.value,
          min_value: r.value,
          max_value: r.value,
        }));
      } else {
        const bucket = resolution === '1min' ? '1 minute' : resolution === '5min' ? '5 minutes' : '1 hour';
        points = await prisma.$queryRawUnsafe<Array<{ bucket: Date; avg_value: number; min_value: number; max_value: number }>>(
          `SELECT time_bucket($1::interval, time) AS bucket,
                  AVG(value) AS avg_value,
                  MIN(value) AS min_value,
                  MAX(value) AS max_value
           FROM measurements
           WHERE data_point_id = $2::uuid AND time >= $3 AND time <= $4
           GROUP BY bucket
           ORDER BY bucket`,
          bucket,
          dpId,
          query.startTime,
          query.endTime,
        );
      }

      results.push({
        dataPointId: dpId,
        tag: dataPoint.tag,
        unit: dataPoint.unit || undefined,
        points: points.map((p) => ({
          time: p.bucket,
          avg: Number(p.avg_value),
          min: Number(p.min_value),
          max: Number(p.max_value),
        })),
      });
    }

    return results;
  }

  async getSOEEvents(startTime: Date, endTime: Date, substationId?: string, limit = 500) {
    let query = `
      SELECT s.time, s.old_state, s.new_state, s.cause,
             dp.tag, dp.name as dp_name, e.name as equip_name
      FROM soe_events s
      JOIN data_points dp ON s.data_point_id = dp.id
      JOIN equipment e ON dp.equipment_id = e.id
      JOIN bays b ON e.bay_id = b.id
      JOIN voltage_levels vl ON b.voltage_level_id = vl.id
      WHERE s.time >= $1 AND s.time <= $2
    `;
    const params: unknown[] = [startTime, endTime];

    if (substationId) {
      query += ` AND vl.substation_id = $3::uuid`;
      params.push(substationId);
    }

    query += ` ORDER BY s.time DESC LIMIT ${limit}`;

    return prisma.$queryRawUnsafe(query, ...params);
  }

  private autoResolution(start: Date, end: Date): TrendResolution {
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diffHours <= 1) return 'raw';
    if (diffHours <= 24) return '1min';
    if (diffHours <= 168) return '5min';
    return '1hour';
  }
}

export const historianService = new HistorianService();
