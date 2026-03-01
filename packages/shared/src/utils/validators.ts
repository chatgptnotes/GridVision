import type { UserRole } from '../types/auth';
import type { AlarmPriority, AlarmType } from '../types/alarm';
import type { BayType, EquipmentType, ParamType, ProtocolType, SubstationType } from '../types/substation';

export function isValidSubstationType(value: string): value is SubstationType {
  return ['33/11kV', '132/33kV'].includes(value);
}

export function isValidUserRole(value: string): value is UserRole {
  return ['ADMIN', 'ENGINEER', 'OPERATOR', 'VIEWER'].includes(value);
}

export function isValidAlarmPriority(value: number): value is AlarmPriority {
  return [1, 2, 3, 4].includes(value);
}

export function isValidAlarmType(value: string): value is AlarmType {
  return [
    'HIGH_HIGH', 'HIGH', 'LOW', 'LOW_LOW',
    'STATE_CHANGE', 'RATE_OF_CHANGE', 'COMMUNICATION_FAIL',
  ].includes(value);
}

export function isValidBayType(value: string): value is BayType {
  return [
    'INCOMER', 'FEEDER', 'TRANSFORMER', 'BUS_COUPLER',
    'BUS_SECTION', 'CAPACITOR', 'LINE',
  ].includes(value);
}

export function isValidEquipmentType(value: string): value is EquipmentType {
  return [
    'CIRCUIT_BREAKER', 'ISOLATOR', 'EARTH_SWITCH', 'POWER_TRANSFORMER',
    'CURRENT_TRANSFORMER', 'POTENTIAL_TRANSFORMER', 'BUS_BAR',
    'FEEDER_LINE', 'LIGHTNING_ARRESTER', 'CAPACITOR_BANK',
  ].includes(value);
}

export function isValidParamType(value: string): value is ParamType {
  return ['ANALOG', 'DIGITAL', 'COUNTER'].includes(value);
}

export function isValidProtocolType(value: string): value is ProtocolType {
  return ['MODBUS_TCP', 'DNP3', 'IEC61850'].includes(value);
}

export function isValidIpAddress(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;
  return ip.split('.').every((octet) => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}
