export interface Measurement {
  time: Date;
  dataPointId: string;
  value: number;
  quality: DataQuality;
}

export interface DigitalState {
  time: Date;
  dataPointId: string;
  state: boolean;
  quality: DataQuality;
}

export interface SOEEvent {
  time: Date;
  dataPointId: string;
  oldState: string;
  newState: string;
  cause?: string;
}

export enum DataQuality {
  GOOD = 0,
  SUSPECT = 1,
  BAD = 2,
  NOT_TOPICAL = 3,
  OVERFLOW = 4,
  MANUAL_OVERRIDE = 5,
}

export interface RealTimeValue {
  tag: string;
  value: number | boolean;
  quality: DataQuality;
  timestamp: Date;
}

export interface RealTimeSnapshot {
  substationId: string;
  timestamp: Date;
  values: Record<string, RealTimeValue>;
}

export interface TrendQuery {
  dataPointIds: string[];
  startTime: Date;
  endTime: Date;
  resolution?: TrendResolution;
}

export type TrendResolution = 'raw' | '1min' | '5min' | '1hour';

export interface TrendData {
  dataPointId: string;
  tag: string;
  unit?: string;
  points: TrendPoint[];
}

export interface TrendPoint {
  time: Date;
  avg: number;
  min: number;
  max: number;
}

export interface AggregatedMeasurement {
  bucket: Date;
  dataPointId: string;
  avgValue: number;
  minValue: number;
  maxValue: number;
}
