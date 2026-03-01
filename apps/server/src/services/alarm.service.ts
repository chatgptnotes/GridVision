import { prisma, redis } from '../config/database';
import type { AlarmDefinition, AlarmPriority, AlarmState, ActiveAlarm, AlarmFilter, AlarmSummary } from '@gridvision/shared';

interface AlarmDefWithContext {
  id: string;
  dataPointId: string;
  alarmType: string;
  threshold: number | null;
  priority: number;
  messageTemplate: string;
  deadband: number;
  delayMs: number;
  isEnabled: boolean;
  lastValue?: number;
  isActive: boolean;
  activeAlarmId?: string;
}

export class AlarmService {
  private alarmDefs: Map<string, AlarmDefWithContext[]> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    const defs = await prisma.alarmDefinition.findMany({
      where: { isEnabled: true },
      include: { dataPoint: true },
    });

    for (const def of defs) {
      const dpId = def.dataPointId;
      if (!this.alarmDefs.has(dpId)) {
        this.alarmDefs.set(dpId, []);
      }
      this.alarmDefs.get(dpId)!.push({
        id: def.id,
        dataPointId: def.dataPointId,
        alarmType: def.alarmType,
        threshold: def.threshold ? Number(def.threshold) : null,
        priority: def.priority,
        messageTemplate: def.messageTemplate,
        deadband: Number(def.deadband),
        delayMs: def.delayMs,
        isEnabled: def.isEnabled,
        isActive: false,
      });
    }

    this.initialized = true;
    console.log(`Alarm engine initialized with ${defs.length} definitions`);
  }

  async evaluateAnalog(dataPointId: string, value: number): Promise<void> {
    if (!this.initialized) return;

    const defs = this.alarmDefs.get(dataPointId);
    if (!defs) return;

    for (const def of defs) {
      if (def.threshold === null) continue;

      let shouldAlarm = false;
      const effectiveDeadband = def.isActive ? def.deadband : 0;

      switch (def.alarmType) {
        case 'HIGH_HIGH':
        case 'HIGH':
          shouldAlarm = value > (def.threshold + effectiveDeadband);
          break;
        case 'LOW':
        case 'LOW_LOW':
          shouldAlarm = value < (def.threshold - effectiveDeadband);
          break;
      }

      if (shouldAlarm && !def.isActive) {
        await this.raiseAlarm(def, value);
      } else if (!shouldAlarm && def.isActive) {
        await this.clearAlarm(def);
      }

      def.lastValue = value;
    }
  }

  async evaluateDigital(dataPointId: string, state: boolean, previousState?: boolean): Promise<void> {
    if (!this.initialized) return;

    const defs = this.alarmDefs.get(dataPointId);
    if (!defs) return;

    for (const def of defs) {
      if (def.alarmType === 'STATE_CHANGE' && previousState !== undefined && state !== previousState) {
        await this.raiseAlarm(def, state ? 1 : 0);
        // Auto-clear state change alarms after a short period
        setTimeout(() => this.clearAlarm(def), 5000);
      }
    }
  }

  private async raiseAlarm(def: AlarmDefWithContext, value: number): Promise<void> {
    const message = def.messageTemplate.replace('{value}', value.toFixed(2));

    const alarmLog = await prisma.alarmLog.create({
      data: {
        alarmDefId: def.id,
        priority: def.priority,
        message,
        valueAtRaise: value,
      },
    });

    def.isActive = true;
    def.activeAlarmId = alarmLog.id;

    // Publish to Redis for real-time notification
    await redis.publish('alarms:raised', JSON.stringify({
      id: alarmLog.id,
      alarmDefId: def.id,
      dataPointId: def.dataPointId,
      alarmType: def.alarmType,
      priority: def.priority,
      message,
      value,
      raisedAt: alarmLog.raisedAt,
    }));
  }

  private async clearAlarm(def: AlarmDefWithContext): Promise<void> {
    if (!def.activeAlarmId) return;

    await prisma.alarmLog.update({
      where: { id: def.activeAlarmId },
      data: { clearedAt: new Date() },
    });

    await redis.publish('alarms:cleared', JSON.stringify({
      id: def.activeAlarmId,
      alarmDefId: def.id,
      dataPointId: def.dataPointId,
    }));

    def.isActive = false;
    def.activeAlarmId = undefined;
  }

  async acknowledgeAlarm(alarmId: string, userId: string): Promise<void> {
    await prisma.alarmLog.update({
      where: { id: alarmId },
      data: { ackedAt: new Date(), ackedBy: userId },
    });

    await redis.publish('alarms:acknowledged', JSON.stringify({ id: alarmId, ackedBy: userId }));
  }

  async shelveAlarm(alarmId: string, durationMinutes: number): Promise<void> {
    const shelvedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
    await prisma.alarmLog.update({
      where: { id: alarmId },
      data: { shelvedUntil },
    });

    await redis.publish('alarms:shelved', JSON.stringify({ id: alarmId, shelvedUntil }));
  }

  async getActiveAlarms(filter?: AlarmFilter): Promise<ActiveAlarm[]> {
    const where: Record<string, unknown> = { clearedAt: null };

    if (filter?.priorities?.length) {
      where.priority = { in: filter.priorities };
    }

    const alarms = await prisma.alarmLog.findMany({
      where,
      include: {
        alarmDef: {
          include: {
            dataPoint: {
              include: {
                equipment: {
                  include: {
                    bay: {
                      include: {
                        voltageLevel: {
                          include: { substation: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [{ priority: 'asc' }, { raisedAt: 'desc' }],
      take: filter?.limit || 100,
      skip: filter?.offset || 0,
    });

    return alarms.map((a) => ({
      id: a.id,
      alarmDefId: a.alarmDefId,
      raisedAt: a.raisedAt,
      clearedAt: a.clearedAt || undefined,
      ackedAt: a.ackedAt || undefined,
      ackedBy: a.ackedBy || undefined,
      shelvedUntil: a.shelvedUntil || undefined,
      valueAtRaise: a.valueAtRaise || undefined,
      priority: a.priority as AlarmPriority,
      message: a.message,
      state: this.getAlarmState(a) as AlarmState,
      tag: a.alarmDef.dataPoint.tag,
      equipmentName: a.alarmDef.dataPoint.equipment.name,
      substationName: a.alarmDef.dataPoint.equipment.bay.voltageLevel.substation.name,
      alarmType: a.alarmDef.alarmType as ActiveAlarm['alarmType'],
    }));
  }

  async getAlarmSummary(): Promise<AlarmSummary> {
    const counts = await prisma.alarmLog.groupBy({
      by: ['priority'],
      where: { clearedAt: null },
      _count: true,
    });

    const unacked = await prisma.alarmLog.count({
      where: { clearedAt: null, ackedAt: null },
    });

    const summary: AlarmSummary = { emergency: 0, urgent: 0, normal: 0, info: 0, total: 0, unacknowledged: unacked };
    for (const c of counts) {
      const count = c._count;
      switch (c.priority) {
        case 1: summary.emergency = count; break;
        case 2: summary.urgent = count; break;
        case 3: summary.normal = count; break;
        case 4: summary.info = count; break;
      }
      summary.total += count;
    }

    return summary;
  }

  private getAlarmState(alarm: { clearedAt: Date | null; ackedAt: Date | null; shelvedUntil: Date | null }): string {
    if (alarm.shelvedUntil && alarm.shelvedUntil > new Date()) return 'SHELVED';
    if (alarm.clearedAt) return 'CLEARED';
    if (alarm.ackedAt) return 'ACKNOWLEDGED';
    return 'RAISED';
  }
}

export const alarmService = new AlarmService();
