import type { AlarmPriority } from '../types/alarm';

export const ALARM_PRIORITIES: Record<AlarmPriority, { level: string; color: string; bgColor: string; sound: string }> = {
  1: { level: 'Emergency', color: '#DC2626', bgColor: '#FEE2E2', sound: 'continuous' },
  2: { level: 'Urgent', color: '#F97316', bgColor: '#FFF7ED', sound: 'intermittent' },
  3: { level: 'Normal', color: '#EAB308', bgColor: '#FEFCE8', sound: 'single' },
  4: { level: 'Info', color: '#3B82F6', bgColor: '#EFF6FF', sound: 'none' },
};

export const ALARM_TYPE_LABELS: Record<string, string> = {
  HIGH_HIGH: 'High-High',
  HIGH: 'High',
  LOW: 'Low',
  LOW_LOW: 'Low-Low',
  STATE_CHANGE: 'State Change',
  RATE_OF_CHANGE: 'Rate of Change',
  COMMUNICATION_FAIL: 'Communication Failure',
};
