export type CBState = 'OPEN' | 'CLOSED' | 'TRIPPED' | 'TRANSITIONING' | 'UNKNOWN';
export type IsolatorState = 'OPEN' | 'CLOSED' | 'UNKNOWN';
export type EarthSwitchState = 'OPEN' | 'CLOSED' | 'UNKNOWN';
export type TransformerState = 'ENERGIZED' | 'DE_ENERGIZED' | 'ON_LOAD';
export type CapacitorState = 'CONNECTED' | 'DISCONNECTED';

export interface CBStatus {
  state: CBState;
  tripCount: number;
  lastOperatedAt?: Date;
}

export interface TransformerStatus {
  state: TransformerState;
  tapPosition: number;
  oilTemperature?: number;
  windingTemperature?: number;
  loadPercent?: number;
}

export interface EquipmentSLDConfig {
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  connectionPoints: ConnectionPoint[];
}

export interface ConnectionPoint {
  id: string;
  x: number;
  y: number;
  direction: 'top' | 'bottom' | 'left' | 'right';
}

export interface SLDLayout {
  id: string;
  substationId: string;
  name: string;
  width: number;
  height: number;
  elements: SLDElement[];
  connections: SLDConnection[];
}

export interface SLDElement {
  id: string;
  equipmentId: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface SLDConnection {
  id: string;
  fromElementId: string;
  fromPoint: string;
  toElementId: string;
  toPoint: string;
  voltageLevel: number;
}

export const VOLTAGE_COLORS: Record<number, string> = {
  132: '#1E40AF',
  33: '#DC2626',
  11: '#16A34A',
  0: '#6B7280', // De-energized
};

export const CB_STATE_COLORS: Record<CBState, string> = {
  OPEN: '#16A34A',
  CLOSED: '#DC2626',
  TRIPPED: '#DC2626',
  TRANSITIONING: '#EAB308',
  UNKNOWN: '#6B7280',
};
