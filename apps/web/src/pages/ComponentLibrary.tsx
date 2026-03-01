import { useState, useMemo, lazy, Suspense } from 'react';
import { Search, X, Copy, Check, GripVertical } from 'lucide-react';
import clsx from 'clsx';
import {
  CBSymbol, IsolatorSymbol, EarthSwitchSymbol, FuseSymbol, ContactorSymbol, LoadBreakSwitchSymbol,
  VacuumCBSymbol, SF6CBSymbol, ACBSymbol, MCCBSymbol, MCBSymbol, RCCBSymbol,
  AutoRecloserSymbol, SectionalizerSymbol, RingMainUnitSymbol, GISSymbol,
  TransformerSymbol, GeneratorSymbol, MotorSymbol, CapacitorBankSymbol, ReactorSymbol, BatterySymbol,
  AutoTransformerSymbol, ZigZagTransformerSymbol, InstrumentTransformerSymbol,
  StepVoltageRegulatorSymbol, ShuntReactorSymbol, SeriesReactorSymbol, SaturableReactorSymbol,
  SyncGeneratorSymbol, AsyncMotorSymbol, SyncMotorSymbol, VFDSymbol, SoftStarterSymbol,
  RectifierSymbol, InverterSymbol, UPSDetailSymbol, StaticTransferSwitchSymbol,
  SVCSymbol, STATCOMSymbol, ThyristorSymbol,
  SolarPanelSymbol, SolarInverterSymbol, WindTurbineSymbol, BESSSymbol, SolarStringSymbol,
  CTSymbol, PTSymbol, MeterSymbol, TransducerSymbol,
  EnergyMeterSymbol, PowerAnalyzerSymbol, MaxDemandIndicatorSymbol, FrequencyMeterSymbol,
  SynchroscopeSymbol, PowerFactorMeterSymbol, AmmeterSymbol, VoltmeterSymbol, WattmeterSymbol,
  RelaySymbol,
  OvercurrentRelaySymbol, EarthFaultRelaySymbol, DistanceRelaySymbol, DifferentialRelaySymbol,
  DirectionalRelaySymbol, UnderFrequencyRelaySymbol, OverFrequencyRelaySymbol, LockoutRelaySymbol,
  BuchholzRelaySymbol, OvervoltageRelaySymbol, UndervoltageRelaySymbol, NegativeSequenceRelaySymbol,
  ThermalOverloadRelaySymbol, ReversePowerRelaySymbol, SynchCheckRelaySymbol,
  BusBarSymbol, CableSymbol, LightningArresterSymbol, GroundSymbol, FeederSymbol,
  DoubleBusBarSymbol, BusSectionSymbol, BusTieSymbol, OverheadLineSymbol,
  UndergroundCableSymbol, JunctionSymbol, CrossoverSymbol, TerminalSymbol,
  IndicatorLampSymbol, AlarmHornSymbol, PushButtonSymbol, SelectorSwitchSymbol,
  LEDIndicatorSymbol, DigitalDisplaySymbol,
  PanelSymbol, MCCSymbol, PLCSymbol, HMISymbol,
  CommunicationSymbol, AntennaSymbol, EnclosureSymbol,
  ValveSymbol, PumpSymbol, CompressorSymbol, TankSymbol, HeatExchangerSymbol,
  FilterSymbol, FlowMeterSymbol, PressureGaugeSymbol, TemperatureSensorSymbol, LevelSensorSymbol,
  DGSetSymbol, AVRSymbol, RTCCSymbol, AnnunciatorSymbol,
} from '@/components/scada-symbols';

interface SymbolEntry {
  id: string;
  name: string;
  category: string;
  standard?: string;
  description: string;
  states?: string[];
  component: React.FC<Record<string, unknown>>;
  defaultProps?: Record<string, unknown>;
}

const FC = (c: unknown) => c as React.FC<Record<string, unknown>>;

const SYMBOL_CATALOG: SymbolEntry[] = [
  // ─── Switchgear (16) ──────────────────────────
  { id: 'cb', name: 'Circuit Breaker', category: 'Switchgear', standard: 'IEC', description: 'IEC circuit breaker with OPEN/CLOSED/TRIPPED states', states: ['OPEN', 'CLOSED', 'TRIPPED'], component: FC(CBSymbol) },
  { id: 'vacuum-cb', name: 'Vacuum CB', category: 'Switchgear', standard: 'IEC', description: 'Vacuum circuit breaker with vacuum interrupter detail', states: ['OPEN', 'CLOSED', 'TRIPPED'], component: FC(VacuumCBSymbol) },
  { id: 'sf6-cb', name: 'SF6 CB', category: 'Switchgear', standard: 'IEC', description: 'SF6 gas circuit breaker with gas compartment', states: ['OPEN', 'CLOSED', 'TRIPPED'], component: FC(SF6CBSymbol) },
  { id: 'acb', name: 'Air CB (ACB)', category: 'Switchgear', standard: 'IEC', description: 'Air circuit breaker with arcing chamber', states: ['OPEN', 'CLOSED', 'TRIPPED'], component: FC(ACBSymbol) },
  { id: 'mccb', name: 'MCCB', category: 'Switchgear', standard: 'IEC', description: 'Molded case circuit breaker', states: ['OPEN', 'CLOSED', 'TRIPPED'], component: FC(MCCBSymbol) },
  { id: 'mcb', name: 'MCB', category: 'Switchgear', standard: 'IEC', description: 'Miniature circuit breaker', states: ['ON', 'OFF', 'TRIPPED'], component: FC(MCBSymbol) },
  { id: 'rccb', name: 'RCCB', category: 'Switchgear', standard: 'IEC', description: 'Residual current circuit breaker', states: ['ON', 'OFF', 'TRIPPED'], component: FC(RCCBSymbol) },
  { id: 'isolator', name: 'Isolator', category: 'Switchgear', standard: 'IEC', description: 'IEC disconnector/isolator blade switch', states: ['OPEN', 'CLOSED'], component: FC(IsolatorSymbol) },
  { id: 'earth-switch', name: 'Earth Switch', category: 'Switchgear', standard: 'IEC', description: 'IEC earth switch with ground symbol', states: ['OPEN', 'CLOSED'], component: FC(EarthSwitchSymbol) },
  { id: 'fuse', name: 'Fuse', category: 'Switchgear', standard: 'IEC', description: 'IEC fuse with healthy/blown indication', states: ['HEALTHY', 'BLOWN'], component: FC(FuseSymbol) },
  { id: 'contactor', name: 'Contactor', category: 'Switchgear', standard: 'IEC', description: 'Contactor with magnetic coil indicator', states: ['OPEN', 'CLOSED'], component: FC(ContactorSymbol) },
  { id: 'lbs', name: 'Load Break Switch', category: 'Switchgear', standard: 'IEC', description: 'Load break switch with arc chamber', states: ['OPEN', 'CLOSED'], component: FC(LoadBreakSwitchSymbol) },
  { id: 'auto-recloser', name: 'Auto Recloser', category: 'Switchgear', standard: 'IEEE', description: 'Auto recloser per IEEE C37.60', states: ['OPEN', 'CLOSED', 'LOCKOUT'], component: FC(AutoRecloserSymbol) },
  { id: 'sectionalizer', name: 'Sectionalizer', category: 'Switchgear', standard: 'IEEE', description: 'Sectionalizer with counting indicator', states: ['OPEN', 'CLOSED'], component: FC(SectionalizerSymbol) },
  { id: 'rmu', name: 'Ring Main Unit', category: 'Switchgear', standard: 'IEC', description: 'Ring main unit (RMU) with 3 compartments', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(RingMainUnitSymbol) },
  { id: 'gis', name: 'GIS', category: 'Switchgear', standard: 'IEC', description: 'Gas insulated switchgear', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(GISSymbol) },

  // ─── Transformers & Reactors (9) ──────────────
  { id: 'transformer', name: 'Power Transformer', category: 'Transformers & Reactors', standard: 'IEC', description: '2-winding/3-winding transformer (IEC coupled coils)', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(TransformerSymbol) },
  { id: 'auto-transformer', name: 'Auto Transformer', category: 'Transformers & Reactors', standard: 'IEC', description: 'Auto transformer with single coil and tap', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(AutoTransformerSymbol) },
  { id: 'zigzag-transformer', name: 'Zig-Zag Transformer', category: 'Transformers & Reactors', standard: 'IEC', description: 'Zig-zag/grounding transformer', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(ZigZagTransformerSymbol) },
  { id: 'instrument-transformer', name: 'Instrument Transformer', category: 'Transformers & Reactors', standard: 'IEC', description: 'Combined CT/PT unit', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(InstrumentTransformerSymbol) },
  { id: 'svr', name: 'Step Voltage Regulator', category: 'Transformers & Reactors', standard: 'IEEE', description: 'Step voltage regulator with variable tap', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(StepVoltageRegulatorSymbol) },
  { id: 'shunt-reactor', name: 'Shunt Reactor', category: 'Transformers & Reactors', standard: 'IEC', description: 'Shunt reactor with iron core', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(ShuntReactorSymbol) },
  { id: 'series-reactor', name: 'Series Reactor', category: 'Transformers & Reactors', standard: 'IEC', description: 'Series/current limiting reactor (air core)', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(SeriesReactorSymbol) },
  { id: 'saturable-reactor', name: 'Saturable Reactor', category: 'Transformers & Reactors', standard: 'IEC', description: 'Saturating reactor with control winding', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(SaturableReactorSymbol) },
  { id: 'reactor', name: 'Reactor', category: 'Transformers & Reactors', standard: 'IEC', description: 'Reactor/inductor coil symbol', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(ReactorSymbol) },

  // ─── Rotating Machines (7) ────────────────────
  { id: 'generator', name: 'Generator', category: 'Rotating Machines', standard: 'IEC', description: 'Generator with running/stopped/fault states', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(GeneratorSymbol) },
  { id: 'sync-generator', name: 'Sync Generator', category: 'Rotating Machines', standard: 'IEC', description: 'Synchronous generator with exciter', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(SyncGeneratorSymbol) },
  { id: 'motor', name: 'Motor', category: 'Rotating Machines', standard: 'IEC', description: 'Motor with running/stopped/fault states', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(MotorSymbol) },
  { id: 'async-motor', name: 'Induction Motor', category: 'Rotating Machines', standard: 'IEC', description: 'Asynchronous/induction motor with squirrel cage', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(AsyncMotorSymbol) },
  { id: 'sync-motor', name: 'Sync Motor', category: 'Rotating Machines', standard: 'IEC', description: 'Synchronous motor', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(SyncMotorSymbol) },
  { id: 'vfd', name: 'VFD', category: 'Rotating Machines', standard: 'IEC', description: 'Variable frequency drive with motor', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(VFDSymbol) },
  { id: 'soft-starter', name: 'Soft Starter', category: 'Rotating Machines', standard: 'IEC', description: 'Soft starter with ramping', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(SoftStarterSymbol) },

  // ─── Power Electronics (7) ────────────────────
  { id: 'rectifier', name: 'Rectifier', category: 'Power Electronics', standard: 'IEC', description: 'Rectifier (AC to DC)', states: ['ACTIVE', 'STANDBY', 'FAULT'], component: FC(RectifierSymbol) },
  { id: 'inverter', name: 'Inverter', category: 'Power Electronics', standard: 'IEC', description: 'Inverter (DC to AC)', states: ['ACTIVE', 'STANDBY', 'FAULT'], component: FC(InverterSymbol) },
  { id: 'ups-detail', name: 'UPS System', category: 'Power Electronics', standard: 'IEC', description: 'UPS system (rectifier + battery + inverter)', states: ['ONLINE', 'BATTERY', 'BYPASS', 'FAULT'], component: FC(UPSDetailSymbol) },
  { id: 'sts', name: 'Static Transfer Switch', category: 'Power Electronics', standard: 'IEC', description: 'Static transfer switch (STS)', states: ['SOURCE_A', 'SOURCE_B', 'FAULT'], component: FC(StaticTransferSwitchSymbol) },
  { id: 'svc', name: 'SVC', category: 'Power Electronics', standard: 'IEC', description: 'Static VAR compensator', states: ['ACTIVE', 'STANDBY', 'FAULT'], component: FC(SVCSymbol) },
  { id: 'statcom', name: 'STATCOM', category: 'Power Electronics', standard: 'IEC', description: 'Static synchronous compensator', states: ['ACTIVE', 'STANDBY', 'FAULT'], component: FC(STATCOMSymbol) },
  { id: 'thyristor', name: 'Thyristor/SCR', category: 'Power Electronics', standard: 'IEC', description: 'Thyristor/SCR device', states: ['ON', 'OFF', 'FAULT'], component: FC(ThyristorSymbol) },

  // ─── Renewable Energy (5) ─────────────────────
  { id: 'solar-panel', name: 'Solar Panel', category: 'Renewable Energy', standard: 'IEC', description: 'Solar/PV panel with diode symbol', states: ['GENERATING', 'IDLE', 'FAULT'], component: FC(SolarPanelSymbol) },
  { id: 'solar-inverter', name: 'Solar Inverter', category: 'Renewable Energy', standard: 'IEC', description: 'Solar inverter with MPPT indicator', states: ['ACTIVE', 'STANDBY', 'FAULT'], component: FC(SolarInverterSymbol) },
  { id: 'wind-turbine', name: 'Wind Turbine', category: 'Renewable Energy', standard: 'IEC', description: 'Wind turbine generator', states: ['GENERATING', 'IDLE', 'FAULT'], component: FC(WindTurbineSymbol) },
  { id: 'bess', name: 'BESS', category: 'Renewable Energy', standard: 'IEC', description: 'Battery energy storage system', states: ['CHARGING', 'DISCHARGING', 'STANDBY', 'FAULT'], component: FC(BESSSymbol) },
  { id: 'solar-string', name: 'Solar String', category: 'Renewable Energy', standard: 'IEC', description: 'Solar string/array', states: ['ACTIVE', 'INACTIVE', 'FAULT'], component: FC(SolarStringSymbol) },

  // ─── Metering & Measurement (13) ──────────────
  { id: 'ct', name: 'Current Transformer', category: 'Metering & Measurement', standard: 'IEC', description: 'CT with configurable ratio label', component: FC(CTSymbol), defaultProps: { ratio: '200/5A' } },
  { id: 'pt', name: 'Voltage Transformer', category: 'Metering & Measurement', standard: 'IEC', description: 'PT/VT with configurable ratio', component: FC(PTSymbol), defaultProps: { ratio: '33kV/110V' } },
  { id: 'meter', name: 'Panel Meter', category: 'Metering & Measurement', standard: 'IEC', description: 'Meter with V/A/W/Hz/PF types', component: FC(MeterSymbol), defaultProps: { meterType: 'V' } },
  { id: 'transducer', name: 'Transducer', category: 'Metering & Measurement', standard: 'IEC', description: 'Transducer with signal I/O arrows', component: FC(TransducerSymbol) },
  { id: 'energy-meter', name: 'Energy Meter', category: 'Metering & Measurement', standard: 'IEC', description: 'Energy meter (kWh) with display', states: ['ACTIVE', 'INACTIVE'], component: FC(EnergyMeterSymbol) },
  { id: 'power-analyzer', name: 'Power Analyzer', category: 'Metering & Measurement', standard: 'IEC', description: 'Power quality analyzer/multifunction meter', states: ['ACTIVE', 'INACTIVE'], component: FC(PowerAnalyzerSymbol) },
  { id: 'max-demand', name: 'Max Demand Indicator', category: 'Metering & Measurement', standard: 'IEC', description: 'Maximum demand indicator', states: ['ACTIVE', 'INACTIVE'], component: FC(MaxDemandIndicatorSymbol) },
  { id: 'freq-meter', name: 'Frequency Meter', category: 'Metering & Measurement', standard: 'IEC', description: 'Frequency meter', states: ['ACTIVE', 'INACTIVE'], component: FC(FrequencyMeterSymbol) },
  { id: 'synchroscope', name: 'Synchroscope', category: 'Metering & Measurement', standard: 'IEEE', description: 'Synchroscope for synchronization', states: ['ACTIVE', 'INACTIVE'], component: FC(SynchroscopeSymbol) },
  { id: 'pf-meter', name: 'Power Factor Meter', category: 'Metering & Measurement', standard: 'IEC', description: 'Power factor meter', states: ['ACTIVE', 'INACTIVE'], component: FC(PowerFactorMeterSymbol) },
  { id: 'ammeter', name: 'Ammeter', category: 'Metering & Measurement', standard: 'IEC', description: 'Ammeter (circle with A)', states: ['ACTIVE', 'INACTIVE'], component: FC(AmmeterSymbol) },
  { id: 'voltmeter', name: 'Voltmeter', category: 'Metering & Measurement', standard: 'IEC', description: 'Voltmeter (circle with V)', states: ['ACTIVE', 'INACTIVE'], component: FC(VoltmeterSymbol) },
  { id: 'wattmeter', name: 'Wattmeter', category: 'Metering & Measurement', standard: 'IEC', description: 'Wattmeter (circle with W)', states: ['ACTIVE', 'INACTIVE'], component: FC(WattmeterSymbol) },

  // ─── Protection Relays (16) ───────────────────
  { id: 'relay', name: 'Protection Relay', category: 'Protection Relays', standard: 'ANSI', description: 'Generic relay with ANSI device number', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(RelaySymbol), defaultProps: { ansiNumber: 50 } },
  { id: 'oc-relay', name: '50/51 Overcurrent', category: 'Protection Relays', standard: 'ANSI', description: 'Overcurrent relay (ANSI 50/51)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(OvercurrentRelaySymbol) },
  { id: 'ef-relay', name: '51N Earth Fault', category: 'Protection Relays', standard: 'ANSI', description: 'Earth fault relay (ANSI 51N/51G)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(EarthFaultRelaySymbol) },
  { id: 'dist-relay', name: '21 Distance', category: 'Protection Relays', standard: 'ANSI', description: 'Distance/impedance relay (ANSI 21)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(DistanceRelaySymbol) },
  { id: 'diff-relay', name: '87 Differential', category: 'Protection Relays', standard: 'ANSI', description: 'Differential relay (ANSI 87)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(DifferentialRelaySymbol) },
  { id: 'dir-relay', name: '67 Directional OC', category: 'Protection Relays', standard: 'ANSI', description: 'Directional overcurrent relay (ANSI 67)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(DirectionalRelaySymbol) },
  { id: 'uf-relay', name: '81U Under Frequency', category: 'Protection Relays', standard: 'ANSI', description: 'Under frequency relay (ANSI 81U)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(UnderFrequencyRelaySymbol) },
  { id: 'of-relay', name: '81O Over Frequency', category: 'Protection Relays', standard: 'ANSI', description: 'Over frequency relay (ANSI 81O)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(OverFrequencyRelaySymbol) },
  { id: 'lockout-relay', name: '86 Lockout', category: 'Protection Relays', standard: 'ANSI', description: 'Lockout relay, hand-reset (ANSI 86)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(LockoutRelaySymbol) },
  { id: 'buchholz-relay', name: 'Buchholz', category: 'Protection Relays', standard: 'IEC', description: 'Buchholz gas accumulation relay', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(BuchholzRelaySymbol) },
  { id: 'ov-relay', name: '59 Overvoltage', category: 'Protection Relays', standard: 'ANSI', description: 'Overvoltage relay (ANSI 59)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(OvervoltageRelaySymbol) },
  { id: 'uv-relay', name: '27 Undervoltage', category: 'Protection Relays', standard: 'ANSI', description: 'Undervoltage relay (ANSI 27)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(UndervoltageRelaySymbol) },
  { id: 'neg-seq-relay', name: '46 Negative Seq', category: 'Protection Relays', standard: 'ANSI', description: 'Negative sequence relay (ANSI 46)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(NegativeSequenceRelaySymbol) },
  { id: 'thermal-relay', name: '49 Thermal OL', category: 'Protection Relays', standard: 'ANSI', description: 'Thermal overload relay (ANSI 49)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(ThermalOverloadRelaySymbol) },
  { id: 'rev-power-relay', name: '32 Reverse Power', category: 'Protection Relays', standard: 'ANSI', description: 'Reverse power relay (ANSI 32)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(ReversePowerRelaySymbol) },
  { id: 'synch-check-relay', name: '25 Synch Check', category: 'Protection Relays', standard: 'ANSI', description: 'Synchronism check relay (ANSI 25)', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: FC(SynchCheckRelaySymbol) },

  // ─── Bus & Connections (13) ───────────────────
  { id: 'busbar', name: 'Bus Bar', category: 'Bus & Connections', standard: 'IEC', description: 'Bus bar colored by voltage level', component: FC(BusBarSymbol), defaultProps: { voltageLevel: 33 } },
  { id: 'double-busbar', name: 'Double Bus Bar', category: 'Bus & Connections', standard: 'IEC', description: 'Double bus bar arrangement', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(DoubleBusBarSymbol) },
  { id: 'bus-section', name: 'Bus Section', category: 'Bus & Connections', standard: 'IEC', description: 'Bus section/coupler', states: ['OPEN', 'CLOSED'], component: FC(BusSectionSymbol) },
  { id: 'bus-tie', name: 'Bus Tie', category: 'Bus & Connections', standard: 'IEC', description: 'Bus tie connection', states: ['OPEN', 'CLOSED'], component: FC(BusTieSymbol) },
  { id: 'cable', name: 'Cable/Line', category: 'Bus & Connections', standard: 'IEC', description: 'Cable with direction arrow', component: FC(CableSymbol) },
  { id: 'overhead-line', name: 'Overhead Line', category: 'Bus & Connections', standard: 'IEC', description: 'Overhead transmission line with towers', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(OverheadLineSymbol) },
  { id: 'underground-cable', name: 'Underground Cable', category: 'Bus & Connections', standard: 'IEC', description: 'Underground cable (dashed)', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(UndergroundCableSymbol) },
  { id: 'junction', name: 'Junction', category: 'Bus & Connections', standard: 'IEC', description: 'T-Junction / branch point', states: ['ENERGIZED', 'DE_ENERGIZED'], component: FC(JunctionSymbol) },
  { id: 'crossover', name: 'Crossover', category: 'Bus & Connections', standard: 'IEC', description: 'Wire crossover (no connection)', component: FC(CrossoverSymbol) },
  { id: 'terminal', name: 'Terminal', category: 'Bus & Connections', standard: 'IEC', description: 'Terminal block/connection point', states: ['CONNECTED', 'DISCONNECTED'], component: FC(TerminalSymbol) },
  { id: 'la', name: 'Surge Arrester', category: 'Bus & Connections', standard: 'IEC', description: 'IEC lightning/surge arrester', component: FC(LightningArresterSymbol) },
  { id: 'ground', name: 'Ground/Earth', category: 'Bus & Connections', standard: 'IEC', description: 'Ground symbol (standard/chassis/signal)', component: FC(GroundSymbol) },
  { id: 'feeder', name: 'Feeder', category: 'Bus & Connections', standard: 'IEC', description: 'Overhead line/feeder with direction', component: FC(FeederSymbol), defaultProps: { direction: 'incoming' } },

  // ─── Indicators & Annunciation (7) ────────────
  { id: 'indicator-lamp', name: 'Indicator Lamp', category: 'Indicators & Annunciation', standard: 'IEC', description: 'Indicator lamp (red/green/amber)', states: ['RED', 'GREEN', 'AMBER', 'OFF'], component: FC(IndicatorLampSymbol) },
  { id: 'alarm-horn', name: 'Alarm Horn', category: 'Indicators & Annunciation', standard: 'IEC', description: 'Audible alarm horn', states: ['ACTIVE', 'SILENT'], component: FC(AlarmHornSymbol) },
  { id: 'push-button', name: 'Push Button', category: 'Indicators & Annunciation', standard: 'IEC', description: 'Push button (NO/NC)', states: ['PRESSED', 'RELEASED'], component: FC(PushButtonSymbol) },
  { id: 'selector-switch', name: 'Selector Switch', category: 'Indicators & Annunciation', standard: 'IEC', description: 'Selector switch (LOCAL/REMOTE/OFF)', states: ['LOCAL', 'REMOTE', 'OFF'], component: FC(SelectorSwitchSymbol) },
  { id: 'led-indicator', name: 'LED Indicator', category: 'Indicators & Annunciation', standard: 'IEC', description: 'LED status indicator (multi-color)', states: ['RED', 'GREEN', 'AMBER', 'BLUE', 'OFF'], component: FC(LEDIndicatorSymbol) },
  { id: 'digital-display', name: 'Digital Display', category: 'Indicators & Annunciation', standard: 'IEC', description: '7-segment digital display', states: ['ACTIVE', 'INACTIVE'], component: FC(DigitalDisplaySymbol) },
  { id: 'annunciator', name: 'Annunciator', category: 'Indicators & Annunciation', standard: 'IEC', description: 'Alarm annunciator window panel', component: FC(AnnunciatorSymbol), defaultProps: { windows: 8, activeWindows: [1, 4] } },

  // ─── Infrastructure & Enclosures (7) ──────────
  { id: 'panel', name: 'Control Panel', category: 'Infrastructure & Enclosures', standard: 'IEC', description: 'Control panel/cubicle', states: ['ACTIVE', 'INACTIVE'], component: FC(PanelSymbol) },
  { id: 'mcc', name: 'MCC', category: 'Infrastructure & Enclosures', standard: 'IEC', description: 'Motor control center', states: ['ACTIVE', 'INACTIVE'], component: FC(MCCSymbol) },
  { id: 'plc', name: 'PLC/RTU', category: 'Infrastructure & Enclosures', standard: 'IEC', description: 'PLC/RTU with I/O labels', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(PLCSymbol) },
  { id: 'hmi', name: 'HMI Panel', category: 'Infrastructure & Enclosures', standard: 'IEC', description: 'HMI/operator panel', states: ['ACTIVE', 'INACTIVE'], component: FC(HMISymbol) },
  { id: 'comm-link', name: 'Comm Link', category: 'Infrastructure & Enclosures', standard: 'IEC', description: 'Communication link (fiber/copper)', states: ['CONNECTED', 'DISCONNECTED', 'FAULT'], component: FC(CommunicationSymbol) },
  { id: 'antenna', name: 'Antenna', category: 'Infrastructure & Enclosures', standard: 'IEC', description: 'Antenna/wireless link', states: ['ACTIVE', 'INACTIVE'], component: FC(AntennaSymbol) },
  { id: 'enclosure', name: 'Enclosure', category: 'Infrastructure & Enclosures', standard: 'IEC', description: 'Equipment enclosure/room', states: ['ACTIVE', 'INACTIVE'], component: FC(EnclosureSymbol) },

  // ─── Piping & Mechanical (10) ─────────────────
  { id: 'valve', name: 'Control Valve', category: 'Piping & Mechanical', standard: 'ISA', description: 'Control valve (gate/globe/ball)', states: ['OPEN', 'CLOSED', 'THROTTLED', 'FAULT'], component: FC(ValveSymbol) },
  { id: 'pump', name: 'Pump', category: 'Piping & Mechanical', standard: 'ISA', description: 'Centrifugal pump', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(PumpSymbol) },
  { id: 'compressor', name: 'Compressor', category: 'Piping & Mechanical', standard: 'ISA', description: 'Compressor', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(CompressorSymbol) },
  { id: 'tank', name: 'Storage Tank', category: 'Piping & Mechanical', standard: 'ISA', description: 'Storage tank with level indicator', states: ['NORMAL', 'HIGH', 'LOW', 'EMPTY'], component: FC(TankSymbol) },
  { id: 'heat-exchanger', name: 'Heat Exchanger', category: 'Piping & Mechanical', standard: 'ISA', description: 'Heat exchanger', states: ['ACTIVE', 'INACTIVE'], component: FC(HeatExchangerSymbol) },
  { id: 'filter', name: 'Filter/Strainer', category: 'Piping & Mechanical', standard: 'ISA', description: 'Filter/strainer', states: ['CLEAN', 'DIRTY', 'BLOCKED'], component: FC(FilterSymbol) },
  { id: 'flow-meter', name: 'Flow Meter', category: 'Piping & Mechanical', standard: 'ISA', description: 'Flow meter', states: ['ACTIVE', 'INACTIVE'], component: FC(FlowMeterSymbol) },
  { id: 'pressure-gauge', name: 'Pressure Gauge', category: 'Piping & Mechanical', standard: 'ISA', description: 'Pressure gauge', states: ['NORMAL', 'HIGH', 'LOW'], component: FC(PressureGaugeSymbol) },
  { id: 'temp-sensor', name: 'Temperature Sensor', category: 'Piping & Mechanical', standard: 'ISA', description: 'Temperature sensor/RTD/thermocouple', states: ['NORMAL', 'HIGH', 'LOW'], component: FC(TemperatureSensorSymbol) },
  { id: 'level-sensor', name: 'Level Sensor', category: 'Piping & Mechanical', standard: 'ISA', description: 'Level sensor/transmitter', states: ['NORMAL', 'HIGH', 'LOW'], component: FC(LevelSensorSymbol) },

  // ─── Miscellaneous (3) ────────────────────────
  { id: 'dgset', name: 'DG Set', category: 'Miscellaneous', standard: 'IEC', description: 'Diesel generator set', states: ['RUNNING', 'STOPPED', 'FAULT'], component: FC(DGSetSymbol) },
  { id: 'avr', name: 'AVR', category: 'Miscellaneous', standard: 'IEC', description: 'Automatic voltage regulator', states: ['AUTO', 'MANUAL', 'FAULT'], component: FC(AVRSymbol) },
  { id: 'rtcc', name: 'RTCC', category: 'Miscellaneous', standard: 'IEC', description: 'Remote tap change controller', states: ['AUTO', 'MANUAL', 'LOCAL'], component: FC(RTCCSymbol), defaultProps: { tapPosition: 16 } },
];

const CATEGORIES = [
  'All', 'Switchgear', 'Transformers & Reactors', 'Rotating Machines', 'Power Electronics',
  'Renewable Energy', 'Metering & Measurement', 'Protection Relays', 'Bus & Connections',
  'Indicators & Annunciation', 'Infrastructure & Enclosures', 'Piping & Mechanical', 'Miscellaneous',
];

const STANDARD_COLORS: Record<string, string> = {
  IEC: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  IEEE: 'bg-green-500/20 text-green-400 border-green-500/30',
  ANSI: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ISA: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  IS: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export default function ComponentLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolEntry | null>(null);
  const [activeState, setActiveState] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    return SYMBOL_CATALOG.filter((s) => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SYMBOL_CATALOG.length };
    SYMBOL_CATALOG.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleCopySvg = () => {
    if (!selectedSymbol) return;
    const el = document.getElementById('symbol-preview-svg');
    if (el) {
      const svgContent = el.innerHTML;
      navigator.clipboard.writeText(svgContent).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-scada-border px-6 py-4 shrink-0">
        <h1 className="text-xl font-semibold text-white mb-1">SCADA Component Library</h1>
        <p className="text-sm text-gray-400">
          {SYMBOL_CATALOG.length} IEC/IEEE/ANSI/ISA standard symbols for SLD and mimic diagram design
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — catalog */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-scada-border">
          {/* Search & filters */}
          <div className="px-4 py-3 border-b border-scada-border space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search symbols..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-scada-bg border border-scada-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-scada-accent"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={clsx(
                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                    activeCategory === cat
                      ? 'bg-scada-accent text-white'
                      : 'bg-scada-bg text-gray-400 hover:text-white border border-scada-border'
                  )}
                >
                  {cat} ({categoryCounts[cat] || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Symbol grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filtered.map((sym) => {
                const Comp = sym.component;
                return (
                  <button
                    key={sym.id}
                    onClick={() => {
                      setSelectedSymbol(sym);
                      setActiveState(sym.states?.[0]);
                    }}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:shadow-lg group',
                      selectedSymbol?.id === sym.id
                        ? 'border-scada-accent bg-scada-accent/10 shadow-scada-accent/20'
                        : 'border-scada-border bg-scada-panel hover:border-gray-600'
                    )}
                  >
                    <div className="w-full flex items-center justify-center h-20 bg-white/95 rounded-lg p-2 relative">
                      <Comp width={48} height={56} {...(sym.defaultProps || {})} />
                      {sym.standard && (
                        <span className={clsx('absolute top-1 left-1 px-1 py-0.5 rounded text-[8px] font-bold border', STANDARD_COLORS[sym.standard] || 'bg-gray-500/20 text-gray-400 border-gray-500/30')}>
                          {sym.standard}
                        </span>
                      )}
                      <GripVertical className="absolute top-1 right-1 w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xs text-gray-300 text-center leading-tight font-medium">{sym.name}</span>
                  </button>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No symbols match your search.
              </div>
            )}
          </div>
        </div>

        {/* Right panel — detail view */}
        <div className="w-80 lg:w-96 flex flex-col overflow-y-auto shrink-0 bg-scada-panel">
          {selectedSymbol ? (
            <div className="p-5 space-y-5">
              {/* Preview */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-white">{selectedSymbol.name}</h2>
                  {selectedSymbol.standard && (
                    <span className={clsx('px-1.5 py-0.5 rounded text-[10px] font-bold border', STANDARD_COLORS[selectedSymbol.standard] || 'bg-gray-500/20 text-gray-400 border-gray-500/30')}>
                      {selectedSymbol.standard}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-3">{selectedSymbol.description}</p>
                <div id="symbol-preview-svg" className="bg-white rounded-xl p-6 flex items-center justify-center min-h-[140px]">
                  {(() => {
                    const Comp = selectedSymbol.component;
                    return <Comp width={100} height={120} state={activeState} {...(selectedSymbol.defaultProps || {})} />;
                  })()}
                </div>
              </div>

              {/* State switcher */}
              {selectedSymbol.states && selectedSymbol.states.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">States</h3>
                  <div className="flex gap-1.5 flex-wrap">
                    {selectedSymbol.states.map((st) => (
                      <button
                        key={st}
                        onClick={() => setActiveState(st)}
                        className={clsx(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          activeState === st
                            ? 'bg-scada-accent text-white'
                            : 'bg-scada-bg text-gray-400 border border-scada-border hover:text-white'
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  {/* All states preview */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {selectedSymbol.states.map((st) => {
                      const Comp = selectedSymbol.component;
                      return (
                        <div
                          key={st}
                          onClick={() => setActiveState(st)}
                          className={clsx(
                            'bg-white rounded-lg p-2 flex flex-col items-center gap-1 cursor-pointer border-2 transition-colors',
                            activeState === st ? 'border-scada-accent' : 'border-transparent'
                          )}
                        >
                          <Comp width={36} height={44} state={st} {...(selectedSymbol.defaultProps || {})} />
                          <span className="text-[9px] text-gray-500 font-medium">{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Properties */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Props</h3>
                <div className="bg-scada-bg rounded-lg border border-scada-border overflow-hidden">
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-scada-border">
                        <td className="px-3 py-1.5 text-gray-400">width</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">number</td>
                      </tr>
                      <tr className="border-b border-scada-border">
                        <td className="px-3 py-1.5 text-gray-400">height</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">number</td>
                      </tr>
                      {selectedSymbol.states && (
                        <tr className="border-b border-scada-border">
                          <td className="px-3 py-1.5 text-gray-400">state</td>
                          <td className="px-3 py-1.5 text-gray-300 font-mono text-[10px]">{selectedSymbol.states.map((s) => `'${s}'`).join(' | ')}</td>
                        </tr>
                      )}
                      <tr className="border-b border-scada-border">
                        <td className="px-3 py-1.5 text-gray-400">color</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">string</td>
                      </tr>
                      <tr className="border-b border-scada-border">
                        <td className="px-3 py-1.5 text-gray-400">onClick</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">() =&gt; void</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1.5 text-gray-400">label</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">string</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</h3>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs bg-scada-bg text-gray-300 border border-scada-border">
                  {selectedSymbol.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopySvg}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium bg-scada-accent text-white hover:bg-scada-accent/90 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy SVG'}
                </button>
              </div>

              {/* Drag hint */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-scada-bg border border-scada-border">
                <GripVertical className="w-4 h-4 text-gray-500 shrink-0" />
                <p className="text-[11px] text-gray-500">
                  Drag symbols to the Mimic Editor to place them on your diagram
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-scada-bg border border-scada-border flex items-center justify-center">
                  <Search className="w-7 h-7 text-gray-600" />
                </div>
                <p className="text-sm font-medium">Select a symbol</p>
                <p className="text-xs mt-1">Click any symbol to see its states, properties, and preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
