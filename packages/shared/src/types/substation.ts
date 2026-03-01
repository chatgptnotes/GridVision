export interface Substation {
  id: string;
  name: string;
  code: string;
  type: SubstationType;
  location?: string;
  latitude?: number;
  longitude?: number;
  commissionedAt?: Date;
  status: SubstationStatus;
  createdAt: Date;
  updatedAt: Date;
  voltageLevels?: VoltageLevel[];
}

export type SubstationType = '33/11kV' | '132/33kV';
export type SubstationStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface VoltageLevel {
  id: string;
  substationId: string;
  nominalKv: number;
  levelType: VoltageLevelType;
  busConfig: BusConfiguration;
  bays?: Bay[];
}

export type VoltageLevelType = 'HV' | 'LV' | 'TV';
export type BusConfiguration = 'SINGLE_BUS' | 'SINGLE_BUS_SECTION' | 'DOUBLE_BUS';

export interface Bay {
  id: string;
  voltageLevelId: string;
  name: string;
  bayType: BayType;
  bayNumber?: number;
  status: BayStatus;
  equipment?: Equipment[];
}

export type BayType =
  | 'INCOMER'
  | 'FEEDER'
  | 'TRANSFORMER'
  | 'BUS_COUPLER'
  | 'BUS_SECTION'
  | 'CAPACITOR'
  | 'LINE';

export type BayStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Equipment {
  id: string;
  bayId: string;
  type: EquipmentType;
  tag: string;
  name: string;
  ratedVoltage?: number;
  ratedCurrent?: number;
  ratedMva?: number;
  sldX: number;
  sldY: number;
  sldRotation: number;
  metadata: Record<string, unknown>;
  dataPoints?: DataPoint[];
}

export type EquipmentType =
  | 'CIRCUIT_BREAKER'
  | 'ISOLATOR'
  | 'EARTH_SWITCH'
  | 'POWER_TRANSFORMER'
  | 'CURRENT_TRANSFORMER'
  | 'POTENTIAL_TRANSFORMER'
  | 'BUS_BAR'
  | 'FEEDER_LINE'
  | 'LIGHTNING_ARRESTER'
  | 'CAPACITOR_BANK';

export interface DataPoint {
  id: string;
  equipmentId: string;
  tag: string;
  name: string;
  paramType: ParamType;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  deadband: number;
  iedConnectionId?: string;
  registerAddress?: number;
  registerType?: string;
  scaleFactor: number;
  offsetValue: number;
}

export type ParamType = 'ANALOG' | 'DIGITAL' | 'COUNTER';

export interface IedConnection {
  id: string;
  substationId: string;
  name: string;
  protocol: ProtocolType;
  ipAddress: string;
  port: number;
  slaveId?: number;
  pollingIntervalMs: number;
  timeoutMs: number;
  status: IedConnectionStatus;
}

export type ProtocolType = 'MODBUS_TCP' | 'DNP3' | 'IEC61850';
export type IedConnectionStatus = 'ACTIVE' | 'INACTIVE' | 'COMMUNICATION_FAIL';
