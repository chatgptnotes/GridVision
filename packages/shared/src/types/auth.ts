export type UserRole = 'ADMIN' | 'ENGINEER' | 'OPERATOR' | 'VIEWER';

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface TokenPayload {
  userId: string;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuditEntry {
  id: string;
  userId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  timestamp: Date;
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    'view:sld',
    'view:dashboard',
    'view:trends',
    'view:alarms',
    'ack:alarms',
    'control:operate',
    'edit:alarm_config',
    'edit:sld_layout',
    'manage:users',
    'view:audit',
    'generate:reports',
    'manage:settings',
  ],
  ENGINEER: [
    'view:sld',
    'view:dashboard',
    'view:trends',
    'view:alarms',
    'ack:alarms',
    'edit:alarm_config',
    'edit:sld_layout',
    'view:audit',
    'generate:reports',
  ],
  OPERATOR: [
    'view:sld',
    'view:dashboard',
    'view:trends',
    'view:alarms',
    'ack:alarms',
    'control:operate',
    'generate:reports',
  ],
  VIEWER: [
    'view:sld',
    'view:dashboard',
    'view:trends',
    'view:alarms',
    'generate:reports',
  ],
};
