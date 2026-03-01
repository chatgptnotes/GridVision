export interface RelayCode {
  name: string;
  desc: string;
  applications: string[];
}

export const ANSI_RELAY_CODES: Record<string, RelayCode> = {
  '21': { name: 'Distance Protection', desc: 'Impedance relay for line protection', applications: ['Transmission lines', 'Long feeders'] },
  '25': { name: 'Synchronism Check', desc: 'Prevents out-of-phase closing', applications: ['Generator', 'Bus coupler'] },
  '27': { name: 'Undervoltage', desc: 'Operates on voltage below setpoint', applications: ['Bus', 'Motor'] },
  '32': { name: 'Reverse Power', desc: 'Detects reverse power flow', applications: ['Generator'] },
  '46': { name: 'Negative Sequence Current', desc: 'Unbalanced current protection', applications: ['Motor', 'Generator'] },
  '49': { name: 'Thermal Overload', desc: 'Thermal image protection', applications: ['Transformer', 'Motor'] },
  '50': { name: 'Instantaneous Overcurrent', desc: 'Fast acting, no intentional delay', applications: ['All feeders', 'Transformers'] },
  '51': { name: 'Time Overcurrent', desc: 'IDMT/definite time OC', applications: ['All feeders', 'Incomers'] },
  '51N': { name: 'Earth Fault', desc: 'Ground fault protection', applications: ['All feeders'] },
  '52': { name: 'AC Circuit Breaker', desc: 'CB control and status', applications: ['All bays'] },
  '59': { name: 'Overvoltage', desc: 'Voltage above setpoint', applications: ['Bus', 'Generator'] },
  '64': { name: 'Ground Detector', desc: 'Stator earth fault', applications: ['Generator'] },
  '67': { name: 'Directional Overcurrent', desc: 'OC with direction sensing', applications: ['Ring main', 'Parallel feeders'] },
  '79': { name: 'Auto Reclosing', desc: 'Automatic reclosure after fault', applications: ['Feeders', 'Lines'] },
  '81': { name: 'Frequency', desc: 'Over/under frequency', applications: ['Generator', 'Grid connection'] },
  '86': { name: 'Lockout Relay', desc: 'Latching trip, manual reset required', applications: ['Transformer', 'Generator'] },
  '87': { name: 'Differential Protection', desc: 'Current differential comparison', applications: ['Transformer', 'Bus', 'Generator'] },
  '87T': { name: 'Transformer Differential', desc: 'Transformer-specific differential', applications: ['Power transformer'] },
};
