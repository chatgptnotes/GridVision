import type { ProtocolAdapter, ConnectionStatus, AdapterConfig } from './ProtocolAdapter';

export class SimulatorAdapter implements ProtocolAdapter {
  private status: ConnectionStatus = 'DISCONNECTED';
  private statusCallbacks: Array<(connected: boolean) => void> = [];
  private config: AdapterConfig;
  private analogValues: Map<number, number> = new Map();
  private digitalValues: Map<number, boolean> = new Map();
  private intervalHandle?: NodeJS.Timeout;

  constructor(config: AdapterConfig) {
    this.config = config;
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    // Default analog values (holding registers)
    // Transformer HV voltage ~33kV
    this.analogValues.set(100, 330); // scaled by 0.1 = 33.0 kV
    this.analogValues.set(101, 110); // 11.0 kV
    this.analogValues.set(102, 1400); // 140.0 A
    this.analogValues.set(106, 600); // 6.00 MW
    this.analogValues.set(110, 5); // Tap position 5
    this.analogValues.set(111, 450); // 45.0 °C

    // Feeder values
    for (let f = 0; f < 6; f++) {
      const base = 200 + f * 20;
      this.analogValues.set(base, 112); // 11.2 kV
      this.analogValues.set(base + 3, 1500 + Math.random() * 500); // I_R
      this.analogValues.set(base + 4, 1480 + Math.random() * 500); // I_Y
      this.analogValues.set(base + 5, 1520 + Math.random() * 500); // I_B
      this.analogValues.set(base + 6, 100 + Math.random() * 50); // P_3PH (1.0-1.5 MW)
      this.analogValues.set(base + 7, 30 + Math.random() * 20); // Q_3PH (0.3-0.5 MVAR)
      this.analogValues.set(base + 8, 920 + Math.random() * 70); // PF (0.92-0.99)
    }

    // Digital values (coils) - all CBs closed by default
    for (let i = 0; i <= 20; i++) {
      this.digitalValues.set(i, true); // CLOSED
    }
  }

  async connect(): Promise<void> {
    this.status = 'CONNECTED';
    this.notifyStatusChange(true);

    // Start simulating small variations
    this.intervalHandle = setInterval(() => this.simulateVariations(), 1000);

    console.log(`Simulator adapter started: ${this.config.name}`);
  }

  async disconnect(): Promise<void> {
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    this.status = 'DISCONNECTED';
    this.notifyStatusChange(false);
  }

  async readAnalog(address: number, count: number): Promise<number[]> {
    const values: number[] = [];
    for (let i = 0; i < count; i++) {
      values.push(this.analogValues.get(address + i) || 0);
    }
    return values;
  }

  async readDigital(address: number, count: number): Promise<boolean[]> {
    const values: boolean[] = [];
    for (let i = 0; i < count; i++) {
      values.push(this.digitalValues.get(address + i) || false);
    }
    return values;
  }

  async writeDigital(address: number, value: boolean): Promise<boolean> {
    this.digitalValues.set(address, value);
    return true;
  }

  onStatusChange(callback: (connected: boolean) => void): void {
    this.statusCallbacks.push(callback);
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  private simulateVariations(): void {
    // Add small random variations to analog values
    for (const [addr, value] of this.analogValues) {
      const variation = (Math.random() - 0.5) * value * 0.02; // ±1% variation
      this.analogValues.set(addr, value + variation);
    }
  }

  private notifyStatusChange(connected: boolean): void {
    this.statusCallbacks.forEach((cb) => cb(connected));
  }
}
