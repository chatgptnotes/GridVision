export type ConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'ERROR';

export interface ProtocolAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  readAnalog(address: number, count: number): Promise<number[]>;
  readDigital(address: number, count: number): Promise<boolean[]>;
  writeDigital(address: number, value: boolean): Promise<boolean>;
  onStatusChange(callback: (connected: boolean) => void): void;
  getStatus(): ConnectionStatus;
}

export interface AdapterConfig {
  id: string;
  name: string;
  protocol: string;
  ipAddress: string;
  port: number;
  slaveId?: number;
  pollingIntervalMs: number;
  timeoutMs: number;
}
