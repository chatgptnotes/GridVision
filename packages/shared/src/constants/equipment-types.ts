import type { EquipmentType } from '../types/substation';

export const EQUIPMENT_TYPE_CONFIG: Record<EquipmentType, { label: string; abbreviation: string; hasControl: boolean }> = {
  CIRCUIT_BREAKER: { label: 'Circuit Breaker', abbreviation: 'CB', hasControl: true },
  ISOLATOR: { label: 'Isolator', abbreviation: 'ISO', hasControl: true },
  EARTH_SWITCH: { label: 'Earth Switch', abbreviation: 'ES', hasControl: true },
  POWER_TRANSFORMER: { label: 'Power Transformer', abbreviation: 'TR', hasControl: false },
  CURRENT_TRANSFORMER: { label: 'Current Transformer', abbreviation: 'CT', hasControl: false },
  POTENTIAL_TRANSFORMER: { label: 'Potential Transformer', abbreviation: 'PT', hasControl: false },
  BUS_BAR: { label: 'Bus Bar', abbreviation: 'BUS', hasControl: false },
  FEEDER_LINE: { label: 'Feeder Line', abbreviation: 'FDR', hasControl: false },
  LIGHTNING_ARRESTER: { label: 'Lightning Arrester', abbreviation: 'LA', hasControl: false },
  CAPACITOR_BANK: { label: 'Capacitor Bank', abbreviation: 'CAP', hasControl: true },
};

export const CONTROLLABLE_EQUIPMENT: EquipmentType[] = [
  'CIRCUIT_BREAKER',
  'ISOLATOR',
  'EARTH_SWITCH',
  'CAPACITOR_BANK',
];
