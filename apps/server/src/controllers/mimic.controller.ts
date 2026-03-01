import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';

const createPageSchema = z.object({
  name: z.string().min(1).max(100),
  width: z.number().int().min(800).max(7680).default(1920),
  height: z.number().int().min(600).max(4320).default(1080),
  backgroundColor: z.string().max(20).default('#FFFFFF'),
  gridSize: z.number().int().min(5).max(100).default(20),
});

const updatePageSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  pageOrder: z.number().int().min(0).optional(),
  width: z.number().int().min(800).max(7680).optional(),
  height: z.number().int().min(600).max(4320).optional(),
  backgroundColor: z.string().max(20).optional(),
  gridSize: z.number().int().min(5).max(100).optional(),
  elements: z.any().optional(),
  connections: z.any().optional(),
  isHomePage: z.boolean().optional(),
});

async function checkProjectAccess(userId: string, projectId: string, requiredRoles?: string[]) {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member) return null;
  if (requiredRoles && !requiredRoles.includes(member.role)) return null;
  return member;
}

// GET /api/projects/:id/pages
export async function getPages(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const access = await checkProjectAccess(req.user!.userId, id);
  if (!access) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  const pages = await prisma.mimicPage.findMany({
    where: { projectId: id },
    orderBy: { pageOrder: 'asc' },
  });
  res.json(pages);
}

// GET /api/projects/:id/pages/:pageId
export async function getPage(req: Request, res: Response): Promise<void> {
  const { id, pageId } = req.params;
  const access = await checkProjectAccess(req.user!.userId, id);
  if (!access) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  const page = await prisma.mimicPage.findFirst({
    where: { id: pageId, projectId: id },
  });
  if (!page) {
    res.status(404).json({ error: 'Page not found' });
    return;
  }
  res.json(page);
}

// POST /api/projects/:id/pages
export async function createPage(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const access = await checkProjectAccess(req.user!.userId, id, ['OWNER', 'ADMIN']);
    if (!access) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const data = createPageSchema.parse(req.body);
    const maxOrder = await prisma.mimicPage.aggregate({
      where: { projectId: id },
      _max: { pageOrder: true },
    });
    const page = await prisma.mimicPage.create({
      data: {
        projectId: id,
        name: data.name,
        pageOrder: (maxOrder._max.pageOrder ?? -1) + 1,
        width: data.width,
        height: data.height,
        backgroundColor: data.backgroundColor,
        gridSize: data.gridSize,
      },
    });
    res.status(201).json(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create page' });
  }
}

// PUT /api/projects/:id/pages/:pageId
export async function updatePage(req: Request, res: Response): Promise<void> {
  try {
    const { id, pageId } = req.params;
    const access = await checkProjectAccess(req.user!.userId, id, ['OWNER', 'ADMIN']);
    if (!access) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    const existing = await prisma.mimicPage.findFirst({ where: { id: pageId, projectId: id } });
    if (!existing) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    const data = updatePageSchema.parse(req.body);
    // If setting as home page, unset others
    if (data.isHomePage) {
      await prisma.mimicPage.updateMany({
        where: { projectId: id, isHomePage: true },
        data: { isHomePage: false },
      });
    }
    const page = await prisma.mimicPage.update({
      where: { id: pageId },
      data,
    });
    res.json(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update page' });
  }
}

// DELETE /api/projects/:id/pages/:pageId
export async function deletePage(req: Request, res: Response): Promise<void> {
  const { id, pageId } = req.params;
  const access = await checkProjectAccess(req.user!.userId, id, ['OWNER', 'ADMIN']);
  if (!access) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  const existing = await prisma.mimicPage.findFirst({ where: { id: pageId, projectId: id } });
  if (!existing) {
    res.status(404).json({ error: 'Page not found' });
    return;
  }
  await prisma.mimicPage.delete({ where: { id: pageId } });
  res.json({ message: 'Page deleted' });
}
