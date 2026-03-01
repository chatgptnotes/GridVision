import type { ProtocolAdapter, ConnectionStatus, AdapterConfig } from './ProtocolAdapter';

export class DNP3Adapter implements ProtocolAdapter {
  private status: ConnectionStatus = 'DISCONNECTED';
  private statusCallbacks: Array<(connected: boolean) => void> = [];
  private config: AdapterConfig;

  constructor(config: AdapterConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    this.status = 'CONNECTING';
    try {
      // In production, use node-dnp3 / OpenDNP3 library
      this.status = 'CONNECTED';
      this.notifyStatusChange(true);
      console.log(`DNP3 adapter connected: ${this.config.name} (${this.config.ipAddress}:${this.config.port})`);
    } catch (error) {
      this.status = 'ERROR';
      this.notifyStatusChange(false);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.status = 'DISCONNECTED';
    this.notifyStatusChange(false);
  }

  async readAnalog(address: number, count: number): Promise<number[]> {
    if (this.status !== 'CONNECTED') throw new Error('Not connected');
    return new Array(count).fill(0);
  }

  async readDigital(address: number, count: number): Promise<boolean[]> {
    if (this.status !== 'CONNECTED') throw new Error('Not connected');
    return new Array(count).fill(false);
  }

  async writeDigital(address: number, value: boolean): Promise<boolean> {
    if (this.status !== 'CONNECTED') throw new Error('Not connected');
    return true;
  }

  onStatusChange(callback: (connected: boolean) => void): void {
    this.statusCallbacks.push(callback);
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  private notifyStatusChange(connected: boolean): void {
    this.statusCallbacks.forEach((cb) => cb(connected));
  }
}
