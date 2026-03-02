import { Router } from 'express';
import * as ctrl from '../controllers/navigation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/links', authenticate, ctrl.getLinks);
router.post('/links', authenticate, ctrl.createLink);
router.put('/links/:id', authenticate, ctrl.updateLink);
router.delete('/links/:id', authenticate, ctrl.deleteLink);
router.get('/map', authenticate, ctrl.getNavigationMap);

export default router;
