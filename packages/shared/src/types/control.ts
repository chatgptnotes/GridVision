export type CommandType = 'OPEN' | 'CLOSE' | 'RAISE' | 'LOWER';

export type SBOState =
  | 'SELECT_SENT'
  | 'SELECT_CONFIRMED'
  | 'EXECUTE_SENT'
  | 'EXECUTE_SUCCESS'
  | 'EXECUTE_FAILED'
  | 'CANCELLED'
  | 'TIMEOUT';

export interface ControlCommand {
  id: string;
  equipmentId: string;
  userId: string;
  commandType: CommandType;
  sboState: SBOState;
  initiatedAt: Date;
  completedAt?: Date;
  resultMessage?: string;
}

export interface ControlRequest {
  equipmentId: string;
  commandType: CommandType;
}

export interface ControlSelectResponse {
  commandId: string;
  equipmentTag: string;
  currentState: string;
  proposedAction: CommandType;
  interlockStatus: InterlockCheck[];
  timeoutSeconds: number;
}

export interface ControlExecuteRequest {
  commandId: string;
  confirmationCode?: string;
}

export interface ControlResult {
  commandId: string;
  success: boolean;
  message: string;
  newState?: string;
  timestamp: Date;
}

export interface InterlockCheck {
  rule: string;
  passed: boolean;
  description: string;
}

export interface InterlockRule {
  id: string;
  equipmentId: string;
  ruleType: InterlockRuleType;
  conditionEquipmentId: string;
  conditionState: string;
  blockAction: CommandType;
  description: string;
}

export type InterlockRuleType =
  | 'CB_ISOLATOR'
  | 'EARTH_SWITCH_CB'
  | 'BUS_VOLTAGE_DIFF'
  | 'CUSTOM';

export const SBO_TIMEOUT_SECONDS = 30;
