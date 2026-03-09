import { Request, Response } from 'express';
import {
  generateContent,
  getOrGenerateInfographic,
  clearInfographicCache,
  generateDigitalTwin,
  startDigitalTwinVideo,
  checkVideoOperationStatus,
  getVideoFilePath,
  type ContentType,
} from '../services/gemini.service';
import { prisma } from '../config/database';

const validTypes: ContentType[] = ['features', 'infographic', 'facts', 'description'];

export async function handleGenerateContent(req: Request, res: Response) {
  try {
    const { type } = req.body;

    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid content type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    const content = await generateContent(type as ContentType);

    // Try to parse as JSON if applicable
    let parsed: unknown = content;
    if (type !== 'description') {
      try {
        // Strip markdown code fences if present
        const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = content;
      }
    }

    res.json({ type, content: parsed });
  } catch (error) {
    console.error('Gemini generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate content';
    res.status(500).json({ error: message });
  }
}

/**
 * GET /api/gemini/infographic
 * Returns a Gemini-generated infographic image as a data URI.
 * Caches the result on disk — subsequent requests serve the cached image instantly.
 * Pass ?regenerate=true to force a fresh generation.
 */
export async function handleGetInfographic(req: Request, res: Response) {
  try {
    const forceRegenerate = req.query.regenerate === 'true';
    const result = await getOrGenerateInfographic(forceRegenerate);

    res.json({
      image: `data:${result.mimeType};base64,${result.imageBase64}`,
      mimeType: result.mimeType,
      cached: result.cached,
    });
  } catch (error) {
    console.error('Infographic generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate infographic';
    res.status(500).json({ error: message });
  }
}

/**
 * DELETE /api/gemini/infographic
 * Clears the cached infographic image.
 */
export async function handleClearInfographic(_req: Request, res: Response) {
  try {
    clearInfographicCache();
    res.json({ message: 'Infographic cache cleared' });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
}

/**
 * GET /api/gemini/digital-twin/:projectId
 * Generates a photorealistic 3D digital twin image from the project's SLD data.
 * Caches result per project. Pass ?regenerate=true to force refresh.
 */
export async function handleDigitalTwin(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const forceRegenerate = req.query.regenerate === 'true';

    // Load project with all pages to extract elements
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { mimicPages: { orderBy: { pageOrder: 'asc' } } },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Collect all elements across all pages
    const allElements: any[] = [];
    for (const page of project.mimicPages) {
      if (Array.isArray(page.elements)) {
        allElements.push(...(page.elements as any[]));
      }
    }

    if (allElements.length === 0) {
      return res.status(400).json({ error: 'Project has no SLD elements. Create an SLD first.' });
    }

    const result = await generateDigitalTwin(projectId, project.name, allElements, forceRegenerate);

    res.json({
      image: `data:${result.mimeType};base64,${result.imageBase64}`,
      mimeType: result.mimeType,
      cached: result.cached,
      projectName: project.name,
      elementCount: allElements.length,
    });
  } catch (error) {
    console.error('Digital twin generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate digital twin';
    res.status(500).json({ error: message });
  }
}

// ── Digital Twin VIDEO endpoints (Veo 3.1) ──────────────────────────────────

/**
 * POST /api/gemini/digital-twin-video/:projectId
 * Starts a Veo video generation or returns cached video URL.
 * Pass ?regenerate=true to force a new generation.
 */
export async function handleStartDigitalTwinVideo(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const forceRegenerate = req.query.regenerate === 'true';

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { mimicPages: { orderBy: { pageOrder: 'asc' } } },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const allElements: any[] = [];
    for (const page of project.mimicPages) {
      if (Array.isArray(page.elements)) {
        allElements.push(...(page.elements as any[]));
      }
    }

    if (allElements.length === 0) {
      return res.status(400).json({ error: 'Project has no SLD elements. Create an SLD first.' });
    }

    const result = await startDigitalTwinVideo(projectId, project.name, allElements, forceRegenerate);

    if ('cached' in result) {
      return res.json({ status: 'complete', cached: true, videoUrl: result.videoUrl });
    }

    res.json({ status: 'generating', operationName: result.operationName });
  } catch (error) {
    console.error('Digital twin video start error:', error);
    const message = error instanceof Error ? error.message : 'Failed to start video generation';
    res.status(500).json({ error: message });
  }
}

/**
 * GET /api/gemini/digital-twin-video/:projectId/status?operation=xxx
 * Polls the Veo operation status. Returns { done, videoUrl } when complete.
 */
export async function handleCheckVideoStatus(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const operationName = req.query.operation as string;

    if (!operationName) {
      return res.status(400).json({ error: 'Missing operation query parameter' });
    }

    const result = await checkVideoOperationStatus(projectId, operationName);
    res.json(result);
  } catch (error) {
    console.error('Video status check error:', error);
    const message = error instanceof Error ? error.message : 'Failed to check video status';
    res.status(500).json({ error: message });
  }
}

/**
 * GET /api/gemini/digital-twin-video/:projectId/file
 * Serves the cached MP4 video file.
 */
export async function handleServeVideo(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const filePath = getVideoFilePath(projectId);

    if (!filePath) {
      return res.status(404).json({ error: 'Video not found. Generate it first.' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const stream = require('fs').createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    console.error('Video serve error:', error);
    res.status(500).json({ error: 'Failed to serve video' });
  }
}
