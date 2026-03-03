import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// List custom components for a project
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId || typeof projectId !== 'string') {
      return res.status(400).json({ error: 'projectId query parameter required' });
    }
    const components = await prisma.customComponent.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(components);
  } catch (error) {
    console.error('List custom components error:', error);
    res.status(500).json({ error: 'Failed to list custom components' });
  }
});

// Create custom component
router.post('/', async (req, res) => {
  try {
    const { name, description, category, svgCode, width, height, tagBindings, properties, thumbnail, projectId } = req.body;
    if (!name || !svgCode || !projectId) {
      return res.status(400).json({ error: 'name, svgCode, and projectId are required' });
    }
    // Sanitize SVG: strip script tags and event handlers
    const sanitizedSvg = sanitizeSvg(svgCode);
    const sanitizedThumb = thumbnail ? sanitizeSvg(thumbnail) : null;

    const component = await prisma.customComponent.create({
      data: {
        name,
        description: description || null,
        category: category || 'Custom',
        svgCode: sanitizedSvg,
        width: width || 80,
        height: height || 60,
        tagBindings: tagBindings || null,
        properties: properties || null,
        thumbnail: sanitizedThumb,
        projectId,
        createdBy: (req as any).user?.username || null,
      },
    });
    res.status(201).json(component);
  } catch (error) {
    console.error('Create custom component error:', error);
    res.status(500).json({ error: 'Failed to create custom component' });
  }
});

// Update custom component
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, svgCode, width, height, tagBindings, properties, thumbnail } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (svgCode !== undefined) data.svgCode = sanitizeSvg(svgCode);
    if (width !== undefined) data.width = width;
    if (height !== undefined) data.height = height;
    if (tagBindings !== undefined) data.tagBindings = tagBindings;
    if (properties !== undefined) data.properties = properties;
    if (thumbnail !== undefined) data.thumbnail = thumbnail ? sanitizeSvg(thumbnail) : null;

    const component = await prisma.customComponent.update({
      where: { id },
      data,
    });
    res.json(component);
  } catch (error) {
    console.error('Update custom component error:', error);
    res.status(500).json({ error: 'Failed to update custom component' });
  }
});

// Delete custom component
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customComponent.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete custom component error:', error);
    res.status(500).json({ error: 'Failed to delete custom component' });
  }
});

function sanitizeSvg(svg: string): string {
  // Remove script tags
  let clean = svg.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Remove event handlers (on*)
  clean = clean.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  // Remove javascript: URLs
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
  clean = clean.replace(/xlink:href\s*=\s*["']javascript:[^"']*["']/gi, '');
  return clean;
}

export default router;
