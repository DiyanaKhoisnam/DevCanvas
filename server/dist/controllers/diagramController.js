"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDiagram = exports.saveDiagram = exports.getDiagram = void 0;
const zod_1 = require("zod");
const db_1 = require("../config/db");
const validationService_1 = require("../services/validationService");
const saveDiagramSchema = zod_1.z.object({
    nodes: zod_1.z.array(zod_1.z.any()),
    edges: zod_1.z.array(zod_1.z.any()),
    viewport: zod_1.z.object({
        x: zod_1.z.number(),
        y: zod_1.z.number(),
        zoom: zod_1.z.number(),
    }).optional(),
    settings: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
const getDiagram = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectId = String(req.params.projectId);
        const project = await db_1.prisma.project.findFirst({
            where: { id: projectId, ownerId: userId },
            include: { diagram: true },
        });
        if (!project || !project.diagram) {
            res.status(404).json({ error: 'Diagram not found for this project' });
            return;
        }
        res.json({ diagram: project.diagram });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch diagram' });
    }
};
exports.getDiagram = getDiagram;
const saveDiagram = async (req, res) => {
    try {
        const userId = req.user.id;
        const projectId = String(req.params.projectId);
        const { nodes, edges, viewport, settings } = saveDiagramSchema.parse(req.body);
        const project = await db_1.prisma.project.findFirst({
            where: { id: projectId, ownerId: userId },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const updatedDiagram = await db_1.prisma.diagram.upsert({
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
        await db_1.prisma.project.update({
            where: { id: projectId },
            data: { updatedAt: new Date() },
        });
        res.json({ diagram: updatedDiagram });
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Failed to save diagram' });
    }
};
exports.saveDiagram = saveDiagram;
const validateDiagram = async (req, res) => {
    try {
        const { nodes, edges } = req.body;
        if (!Array.isArray(nodes) || !Array.isArray(edges)) {
            res.status(400).json({ error: 'Invalid nodes or edges format' });
            return;
        }
        const issues = validationService_1.ArchitectureValidationService.validate(nodes, edges);
        const healthScore = validationService_1.ArchitectureValidationService.calculateHealthScore(issues);
        res.json({
            healthScore,
            issuesCount: issues.length,
            issues,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Validation failed' });
    }
};
exports.validateDiagram = validateDiagram;
