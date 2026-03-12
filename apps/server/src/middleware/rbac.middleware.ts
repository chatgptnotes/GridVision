import { Request, Response, NextFunction } from 'express';
import { ROLE_PERMISSIONS, type UserRole } from '@ampris/shared';

export function requirePermission(...permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userRole = req.user.role as UserRole;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = permissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasPermission) {
      res.status(403).json({
        error: 'Insufficient permissions',
        required: permissions,
        userRole,
      });
      return;
    }

    next();
  };
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        error: 'Insufficient role',
        required: roles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}
