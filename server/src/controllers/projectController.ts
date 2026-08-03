import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db';
import { AuthRequest } from '../types';

const createProjectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  templateId: z.string().optional(),
});

const updateProjectSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC', 'SHARED']).optional(),
  thumbnail: z.string().optional(),
});

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { search, tag } = req.query;

    const whereClause: any = { ownerId: userId };
    if (search) {
      whereClause.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (tag) {
      whereClause.tags = { has: String(tag) };
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        diagram: {
          select: { updatedAt: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ projects });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = String(req.params.id);

    const project = await prisma.project.findFirst({
      where: { id, ownerId: userId },
      include: { diagram: true },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json({ project });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { title, description, tags, templateId } = createProjectSchema.parse(req.body);

    let initialNodes: any[] = [];
    let initialEdges: any[] = [];

    if (templateId) {
      const template = await prisma.template.findUnique({ where: { id: templateId } });
      if (template) {
        initialNodes = template.nodes as any[];
        initialEdges = template.edges as any[];
      }
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        tags: tags || [],
        ownerId: userId,
        diagram: {
          create: {
            nodes: initialNodes,
            edges: initialEdges,
            viewport: { x: 0, y: 0, zoom: 1 },
            settings: { gridSnap: true, theme: 'dark' },
          },
        },
      },
      include: { diagram: true },
    });

    res.status(201).json({ project });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Project creation failed' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = String(req.params.id);
    const data = updateProjectSchema.parse(req.body);

    const project = await prisma.project.findFirst({ where: { id, ownerId: userId } });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const updated = await prisma.project.update({
      where: { id },
      data,
    });

    res.json({ project: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Project update failed' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = String(req.params.id);

    const project = await prisma.project.findFirst({ where: { id, ownerId: userId } });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
