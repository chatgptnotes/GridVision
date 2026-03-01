export interface AlarmThreshold {
  param: string;
  highHigh: number | null;
  high: number | null;
  low: number | null;
  lowLow: number | null;
  priority: 1 | 2 | 3 | 4;
  deadband: number;
}

export const ALARM_TEMPLATES: Record<string, AlarmThreshold[]> = {
  '33kV_INCOMER': [
    { param: 'V_RY', highHigh: 36.3, high: 34.65, low: 31.35, lowLow: 29.7, priority: 1, deadband: 0.1 },
    { param: 'I_R', highHigh: 720, high: 640, low: null, lowLow: null, priority: 2, deadband: 5 },
    { param: 'I_Y', highHigh: 720, high: 640, low: null, lowLow: null, priority: 2, deadband: 5 },
    { param: 'I_B', highHigh: 720, high: 640, low: null, lowLow: null, priority: 2, deadband: 5 },
    { param: 'PF', highHigh: null, high: null, low: 0.85, lowLow: 0.80, priority: 3, deadband: 0.01 },
    { param: 'FREQ', highHigh: 50.5, high: 50.2, low: 49.8, lowLow: 49.5, priority: 1, deadband: 0.02 },
    { param: 'THD_V', highHigh: 8, high: 5, low: null, lowLow: null, priority: 3, deadband: 0.5 },
    { param: 'THD_I', highHigh: 12, high: 8, low: null, lowLow: null, priority: 3, deadband: 0.5 },
  ],
  'POWER_TRANSFORMER': [
    { param: 'OIL_TEMP', highHigh: 90, high: 80, low: null, lowLow: null, priority: 1, deadband: 1 },
    { param: 'WDG_TEMP', highHigh: 110, high: 95, low: null, lowLow: null, priority: 1, deadband: 1 },
    { param: 'OIL_LEVEL', highHigh: null, high: null, low: 30, lowLow: 20, priority: 2, deadband: 2 },
    { param: 'LOAD_PCT', highHigh: 130, high: 100, low: null, lowLow: null, priority: 2, deadband: 2 },
    { param: 'SF6_PRESS', highHigh: 6.8, high: null, low: 5.8, lowLow: 5.5, priority: 1, deadband: 0.05 },
    { param: 'TAP_POS', highHigh: 30, high: null, low: null, lowLow: 2, priority: 3, deadband: 0 },
  ],
  '11kV_FEEDER': [
    { param: 'V_RY', highHigh: 12.1, high: 11.55, low: 10.45, lowLow: 9.9, priority: 1, deadband: 0.05 },
    { param: 'I_R', highHigh: 360, high: 320, low: null, lowLow: null, priority: 2, deadband: 2 },
    { param: 'I_Y', highHigh: 360, high: 320, low: null, lowLow: null, priority: 2, deadband: 2 },
    { param: 'I_B', highHigh: 360, high: 320, low: null, lowLow: null, priority: 2, deadband: 2 },
    { param: 'PF', highHigh: null, high: null, low: 0.85, lowLow: 0.80, priority: 3, deadband: 0.01 },
    { param: 'FREQ', highHigh: 50.5, high: 50.2, low: 49.8, lowLow: 49.5, priority: 1, deadband: 0.02 },
  ],
  'STATION_AUX': [
    { param: 'DC_BATT_V', highHigh: 140, high: 135, low: 108, lowLow: 105, priority: 1, deadband: 0.5 },
    { param: 'UPS_LOAD', highHigh: 95, high: 80, low: null, lowLow: null, priority: 2, deadband: 2 },
    { param: 'DG_FUEL', highHigh: null, high: null, low: 25, lowLow: 15, priority: 2, deadband: 2 },
  ],
  '132kV_INCOMER': [
    { param: 'V_RY', highHigh: 145, high: 138.6, low: 125.4, lowLow: 118.8, priority: 1, deadband: 0.5 },
    { param: 'I_R', highHigh: 1080, high: 960, low: null, lowLow: null, priority: 2, deadband: 5 },
    { param: 'I_Y', highHigh: 1080, high: 960, low: null, lowLow: null, priority: 2, deadband: 5 },
    { param: 'I_B', highHigh: 1080, high: 960, low: null, lowLow: null, priority: 2, deadband: 5 },
    { param: 'PF', highHigh: null, high: null, low: 0.85, lowLow: 0.80, priority: 3, deadband: 0.01 },
    { param: 'FREQ', highHigh: 50.5, high: 50.2, low: 49.8, lowLow: 49.5, priority: 1, deadband: 0.02 },
    { param: 'SF6_PRESS', highHigh: 6.8, high: null, low: 5.8, lowLow: 5.5, priority: 1, deadband: 0.05 },
  ],
};
