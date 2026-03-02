import { Router } from 'express';
import * as ctrl from '../controllers/trend-config.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/configs', authenticate, ctrl.getTrendConfigs);
router.post('/configs', authenticate, ctrl.createTrendConfig);
router.put('/configs/:id', authenticate, ctrl.updateTrendConfig);
router.delete('/configs/:id', authenticate, ctrl.deleteTrendConfig);
router.get('/data', authenticate, ctrl.getTrendData);
router.get('/realtime', authenticate, ctrl.getRealtimeData);

export default router;
