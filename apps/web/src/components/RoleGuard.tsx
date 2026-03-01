import type { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@gridvision/shared';

interface RoleGuardProps {
  children: ReactNode;
  roles?: UserRole[];
  permission?: string;
  fallback?: ReactNode;
}

export default function RoleGuard({ children, roles, permission, fallback = null }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  if (!user) return <>{fallback}</>;

  if (roles && !roles.includes(user.role as UserRole)) {
    return <>{fallback}</>;
  }

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
