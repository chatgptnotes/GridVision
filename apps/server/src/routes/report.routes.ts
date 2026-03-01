import { Router } from 'express';
import * as reportCtrl from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

router.get('/daily-load', authenticate, requirePermission('generate:reports'), reportCtrl.getDailyLoadReport);
router.get('/alarm-summary', authenticate, requirePermission('generate:reports'), reportCtrl.getAlarmSummaryReport);
router.get('/audit-trail', authenticate, requirePermission('view:audit'), reportCtrl.getAuditTrail);

export default router;
