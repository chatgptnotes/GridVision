import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/custom-report.controller';

const router = Router();
router.use(authenticate);

router.get('/', ctrl.listCustomReports);
router.get('/available-tags', ctrl.getAvailableTags);
router.get('/:id', ctrl.getCustomReport);
router.post('/', ctrl.createCustomReport);
router.put('/:id', ctrl.updateCustomReport);
router.delete('/:id', ctrl.deleteCustomReport);
router.post('/:id/preview', ctrl.previewReport);
router.post('/:id/generate', ctrl.generateReport);
router.get('/:id/outputs', ctrl.listOutputs);
router.get('/:id/outputs/:outputId/download', ctrl.downloadOutput);

export default router;
