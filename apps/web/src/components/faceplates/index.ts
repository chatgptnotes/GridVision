export { default as BaseFaceplate } from './BaseFaceplate';
export { default as CBFaceplate } from './CBFaceplate';
export { default as TransformerFaceplate } from './TransformerFaceplate';
export { default as GeneratorFaceplate } from './GeneratorFaceplate';
export { default as MotorFaceplate } from './MotorFaceplate';
export { default as MeterFaceplate } from './MeterFaceplate';
export { default as GenericFaceplate } from './GenericFaceplate';

// Map symbol types to faceplate components
export const FACEPLATE_MAP: Record<string, string> = {
  CB: 'CB', VacuumCB: 'CB', SF6CB: 'CB', ACB: 'CB', MCCB: 'CB', MCB: 'CB',
  Transformer: 'Transformer', AutoTransformer: 'Transformer',
  Generator: 'Generator', SyncGenerator: 'Generator',
  Motor: 'Motor', AsyncMotor: 'Motor', SyncMotor: 'Motor',
  Meter: 'Meter', EnergyMeter: 'Meter', PowerAnalyzer: 'Meter',
  Ammeter: 'Meter', Voltmeter: 'Meter', Wattmeter: 'Meter',
};
