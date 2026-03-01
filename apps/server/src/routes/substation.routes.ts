import { Router } from 'express';
import * as substationCtrl from '../controllers/substation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, substationCtrl.getSubstations);
router.get('/:id', authenticate, substationCtrl.getSubstationById);
router.get('/:id/realtime', authenticate, substationCtrl.getSubstationRealtime);
router.get('/:id/equipment', authenticate, substationCtrl.getEquipmentBySubstation);

export default router;
