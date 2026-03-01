export interface AlarmDefinition {
  id: string;
  dataPointId: string;
  alarmType: AlarmType;
  threshold?: number;
  priority: AlarmPriority;
  messageTemplate: string;
  deadband: number;
  delayMs: number;
  isEnabled: boolean;
}

export type AlarmType =
  | 'HIGH_HIGH'
  | 'HIGH'
  | 'LOW'
  | 'LOW_LOW'
  | 'STATE_CHANGE'
  | 'RATE_OF_CHANGE'
  | 'COMMUNICATION_FAIL';

export type AlarmPriority = 1 | 2 | 3 | 4;

export interface AlarmLog {
  id: string;
  alarmDefId: string;
  raisedAt: Date;
  clearedAt?: Date;
  ackedAt?: Date;
  ackedBy?: string;
  shelvedUntil?: Date;
  valueAtRaise?: number;
  priority: AlarmPriority;
  message: string;
}

export type AlarmState = 'RAISED' | 'ACKNOWLEDGED' | 'CLEARED' | 'SHELVED';

export interface ActiveAlarm extends AlarmLog {
  state: AlarmState;
  tag: string;
  equipmentName: string;
  substationName: string;
  alarmType: AlarmType;
}

export const ALARM_PRIORITY_CONFIG: Record<
  AlarmPriority,
  { level: string; color: string; sound: string }
> = {
  1: { level: 'Emergency', color: '#DC2626', sound: 'continuous' },
  2: { level: 'Urgent', color: '#F97316', sound: 'intermittent' },
  3: { level: 'Normal', color: '#EAB308', sound: 'single' },
  4: { level: 'Info', color: '#3B82F6', sound: 'none' },
};

export interface AlarmSummary {
  emergency: number;
  urgent: number;
  normal: number;
  info: number;
  total: number;
  unacknowledged: number;
}

export interface AlarmFilter {
  priorities?: AlarmPriority[];
  alarmTypes?: AlarmType[];
  substationIds?: string[];
  states?: AlarmState[];
  startTime?: Date;
  endTime?: Date;
  limit?: number;
  offset?: number;
}
