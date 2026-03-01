import { Router } from 'express';
import * as alarmCtrl from '../controllers/alarm.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();

router.get('/active', authenticate, alarmCtrl.getActiveAlarms);
router.get('/history', authenticate, alarmCtrl.getAlarmHistory);
router.get('/summary', authenticate, alarmCtrl.getAlarmSummary);
router.post('/:id/acknowledge', authenticate, requirePermission('ack:alarms'), auditLog('ACK_ALARM', 'alarm'), alarmCtrl.acknowledgeAlarm);
router.post('/:id/shelve', authenticate, requirePermission('ack:alarms'), auditLog('SHELVE_ALARM', 'alarm'), alarmCtrl.shelveAlarm);

export default router;
