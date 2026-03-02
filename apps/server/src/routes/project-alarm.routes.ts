import { Router } from 'express';
import * as ctrl from '../controllers/project-alarm.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/definitions', authenticate, ctrl.getDefinitions);
router.post('/definitions', authenticate, ctrl.createDefinition);
router.put('/definitions/:id', authenticate, ctrl.updateDefinition);
router.delete('/definitions/:id', authenticate, ctrl.deleteDefinition);
router.get('/active', authenticate, ctrl.getActiveAlarms);
router.post('/:id/acknowledge', authenticate, ctrl.acknowledgeAlarm);
router.post('/acknowledge-all', authenticate, ctrl.acknowledgeAllAlarms);
router.post('/:id/shelve', authenticate, ctrl.shelveAlarm);
router.post('/:id/unshelve', authenticate, ctrl.unshelveAlarm);
router.post('/:id/suppress', authenticate, ctrl.suppressAlarm);
router.get('/summary', authenticate, ctrl.getAlarmSummary);
router.get('/history', authenticate, ctrl.getAlarmHistory);

export default router;
