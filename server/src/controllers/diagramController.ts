import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db';
import { AuthRequest } from '../types';
import { ArchitectureValidationService } from '../services/validationService';

const saveDiagramSchema = z.object({
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    zoom: z.number(),
  }).optional(),
  settings: z.record(z.string(), z.any()).optional(),
});

export const getDiagram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const projectId = String(req.params.projectId);

    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
      include: { diagram: true },
    });

    if (!project || !project.diagram) {
      res.status(404).json({ error: 'Diagram not found for this project' });
      return;
    }

    res.json({ diagram: project.diagram });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch diagram' });
  }
};

export const saveDiagram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const projectId = String(req.params.projectId);
    const { nodes, edges, viewport, settings } = saveDiagramSchema.parse(req.body);

    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const updatedDiagram = await prisma.diagram.upsert({
      where: { projectId },
      update: {
        nodes,
        edges,
        viewport: viewport || { x: 0, y: 0, zoom: 1 },
        settings: settings || { gridSnap: true, theme: 'dark' },
        version: { increment: 1 },
      },
      create: {
        projectId,
        nodes,
        edges,
        viewport: viewport || { x: 0, y: 0, zoom: 1 },
        settings: settings || { gridSnap: true, theme: 'dark' },
      },
    });

    // Also update project updatedAt timestamp
    await prisma.project.update({
      where: { id: projectId },
      data: { updatedAt: new Date() },
    });

    res.json({ diagram: updatedDiagram });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to save diagram' });
  }
};

export const validateDiagram = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nodes, edges } = req.body;
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      res.status(400).json({ error: 'Invalid nodes or edges format' });
      return;
    }

    const issues = ArchitectureValidationService.validate(nodes, edges);
    const healthScore = ArchitectureValidationService.calculateHealthScore(issues);

    res.json({
      healthScore,
      issuesCount: issues.length,
      issues,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Validation failed' });
  }
};
