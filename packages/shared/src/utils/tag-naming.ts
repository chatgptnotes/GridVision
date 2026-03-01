/**
 * SCADA Tag Naming Convention:
 * {SS_CODE}_{VOLTAGE}_{BAY}_{EQUIP}_{PARAM}
 *
 * Examples:
 * - WALUJ_33KV_INC1_CB_STATUS
 * - WALUJ_11KV_FDR03_I_R
 * - CIDCO_132KV_TR1_V_HV
 */

export interface TagComponents {
  substationCode: string;
  voltageLevel: string;
  bayIdentifier: string;
  equipmentType: string;
  parameter: string;
}

export function buildTag(components: TagComponents): string {
  return [
    components.substationCode,
    components.voltageLevel,
    components.bayIdentifier,
    components.equipmentType,
    components.parameter,
  ].join('_');
}

export function parseTag(tag: string): TagComponents | null {
  const parts = tag.split('_');
  if (parts.length < 5) return null;

  return {
    substationCode: parts[0],
    voltageLevel: parts[1],
    bayIdentifier: parts[2],
    equipmentType: parts[3],
    parameter: parts.slice(4).join('_'),
  };
}

export function getSubstationFromTag(tag: string): string {
  return tag.split('_')[0];
}

export function getVoltageLevelFromTag(tag: string): string {
  return tag.split('_')[1];
}

export function getBayFromTag(tag: string): string {
  return tag.split('_')[2];
}

export const PARAMETER_CODES = {
  // Voltage
  V_RY: 'R-Y Voltage',
  V_YB: 'Y-B Voltage',
  V_BR: 'B-R Voltage',
  V_HV: 'HV Side Voltage',
  V_LV: 'LV Side Voltage',
  // Current
  I_R: 'R-Phase Current',
  I_Y: 'Y-Phase Current',
  I_B: 'B-Phase Current',
  // Power
  P_3PH: 'Three-Phase Active Power',
  Q_3PH: 'Three-Phase Reactive Power',
  S_3PH: 'Three-Phase Apparent Power',
  PF: 'Power Factor',
  // Frequency
  FREQ: 'Frequency',
  // Status
  CB_STATUS: 'Circuit Breaker Status',
  ISO_STATUS: 'Isolator Status',
  ES_STATUS: 'Earth Switch Status',
  // Transformer
  TAP_POS: 'Tap Position',
  OIL_TEMP: 'Oil Temperature',
  WDG_TEMP: 'Winding Temperature',
  // Energy
  KWH_IMP: 'Import Energy',
  KWH_EXP: 'Export Energy',
  KVARH: 'Reactive Energy',
} as const;
