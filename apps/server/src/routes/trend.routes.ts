import { Router } from 'express';
import * as trendCtrl from '../controllers/trend.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/data', authenticate, trendCtrl.getTrend);
router.get('/soe', authenticate, trendCtrl.getSOEEvents);

export default router;
