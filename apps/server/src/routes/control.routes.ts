import { Router } from 'express';
import * as controlCtrl from '../controllers/control.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();

router.post('/select', authenticate, requirePermission('control:operate'), auditLog('CONTROL_SELECT', 'equipment'), controlCtrl.selectControl);
router.post('/execute', authenticate, requirePermission('control:operate'), auditLog('CONTROL_EXECUTE', 'equipment'), controlCtrl.executeControl);
router.post('/cancel', authenticate, requirePermission('control:operate'), auditLog('CONTROL_CANCEL', 'equipment'), controlCtrl.cancelControl);
router.get('/history', authenticate, controlCtrl.getControlHistory);

export default router;
