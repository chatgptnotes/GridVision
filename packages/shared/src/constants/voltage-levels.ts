export const VOLTAGE_LEVELS = {
  '132KV': { nominal: 132, color: '#1E40AF', label: '132 kV' },
  '33KV': { nominal: 33, color: '#DC2626', label: '33 kV' },
  '11KV': { nominal: 11, color: '#16A34A', label: '11 kV' },
} as const;

export const VOLTAGE_THRESHOLDS = {
  132: { highHigh: 145, high: 138.6, low: 125.4, lowLow: 118.8 },
  33: { highHigh: 36.3, high: 34.65, low: 31.35, lowLow: 29.7 },
  11: { highHigh: 12.1, high: 11.55, low: 10.45, lowLow: 9.9 },
} as const;

export const FREQUENCY_NOMINAL = 50;
export const FREQUENCY_HIGH = 50.5;
export const FREQUENCY_LOW = 49.5;
