import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  handleGenerateContent,
  handleGetInfographic,
  handleClearInfographic,
  handleDigitalTwin,
  handleStartDigitalTwinVideo,
  handleCheckVideoStatus,
  handleServeVideo,
} from '../controllers/gemini.controller';

const router = Router();

// Rate limit: 10 requests per minute for AI content generation
const geminiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many AI generation requests, please try again later' },
});

// Rate limit: 3 image generations per minute (heavier operation)
const imageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: 'Too many image generation requests, please try again later' },
});

// Rate limit: 2 video generations per 5 minutes (heaviest operation)
const videoLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2,
  message: { error: 'Too many video generation requests, please try again later' },
});

router.post('/generate-content', geminiLimiter, handleGenerateContent);
router.get('/infographic', imageLimiter, handleGetInfographic);
router.delete('/infographic', handleClearInfographic);
router.get('/digital-twin/:projectId', imageLimiter, handleDigitalTwin);

// Video digital twin (Veo 3.1)
router.post('/digital-twin-video/:projectId', videoLimiter, handleStartDigitalTwinVideo);
router.get('/digital-twin-video/:projectId/status', handleCheckVideoStatus);
router.get('/digital-twin-video/:projectId/file', handleServeVideo);

export default router;
