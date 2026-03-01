import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();

router.post('/login', auditLog('LOGIN'), authCtrl.login);
router.post('/register', authCtrl.register);
router.post('/refresh', authCtrl.refreshToken);
router.post('/logout', authenticate, auditLog('LOGOUT'), authCtrl.logout);
router.get('/profile', authenticate, authCtrl.getProfile);
router.get('/users', authenticate, requireRole('ADMIN'), authCtrl.getUsers);
router.post('/users', authenticate, requireRole('ADMIN'), auditLog('CREATE_USER', 'user'), authCtrl.createUser);
router.patch('/users/:id', authenticate, requireRole('ADMIN'), auditLog('UPDATE_USER', 'user'), authCtrl.updateUser);

export default router;
