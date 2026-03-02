import { Request, Response } from 'express';
import { prisma } from '../config/database';

export async function getLinks(req: Request, res: Response): Promise<void> {
  const { projectId, sourcePageId } = req.query;
  const where: any = {};
  if (projectId) where.projectId = projectId;
  if (sourcePageId) where.sourcePageId = sourcePageId;
  const links = await prisma.navigationLink.findMany({ where });
  res.json(links);
}

export async function createLink(req: Request, res: Response): Promise<void> {
  const link = await prisma.navigationLink.create({ data: req.body });
  res.status(201).json(link);
}

export async function updateLink(req: Request, res: Response): Promise<void> {
  const link = await prisma.navigationLink.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(link);
}

export async function deleteLink(req: Request, res: Response): Promise<void> {
  await prisma.navigationLink.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
}

export async function getNavigationMap(req: Request, res: Response): Promise<void> {
  const { projectId } = req.query;
  if (!projectId) { res.json({ pages: [], links: [] }); return; }

  const pages = await prisma.mimicPage.findMany({
    where: { projectId: projectId as string },
    select: { id: true, name: true, pageOrder: true, isHomePage: true },
    orderBy: { pageOrder: 'asc' },
  });

  const links = await prisma.navigationLink.findMany({
    where: { projectId: projectId as string },
  });

  res.json({ pages, links });
}
