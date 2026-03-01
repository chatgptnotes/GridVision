import { Router } from 'express';
import multer from 'multer';
import { optionalAuth } from '../middleware/auth.middleware';
import { generateSLD } from '../controllers/sld-generation.controller';
import { env } from '../config/environment';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.SLD_GENERATION_MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});

router.post('/generate', optionalAuth, upload.single('file'), generateSLD);

export default router;
