"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const zod_1 = require("zod");
const db_1 = require("../config/db");
const createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    templateId: zod_1.z.string().optional(),
});
const updateProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    visibility: zod_1.z.enum(['PRIVATE', 'PUBLIC', 'SHARED']).optional(),
    thumbnail: zod_1.z.string().optional(),
});
const getProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search, tag } = req.query;
        const whereClause = { ownerId: userId };
        if (search) {
            whereClause.OR = [
                { title: { contains: String(search), mode: 'insensitive' } },
                { description: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        if (tag) {
            whereClause.tags = { has: String(tag) };
        }
        const projects = await db_1.prisma.project.findMany({
            where: whereClause,
            include: {
                diagram: {
                    select: { updatedAt: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        res.json({ projects });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch projects' });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = String(req.params.id);
        const project = await db_1.prisma.project.findFirst({
            where: { id, ownerId: userId },
            include: { diagram: true },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json({ project });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, tags, templateId } = createProjectSchema.parse(req.body);
        let initialNodes = [];
        let initialEdges = [];
        if (templateId) {
            const template = await db_1.prisma.template.findUnique({ where: { id: templateId } });
            if (template) {
                initialNodes = template.nodes;
                initialEdges = template.edges;
            }
        }
        const project = await db_1.prisma.project.create({
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
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Project creation failed' });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = String(req.params.id);
        const data = updateProjectSchema.parse(req.body);
        const project = await db_1.prisma.project.findFirst({ where: { id, ownerId: userId } });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const updated = await db_1.prisma.project.update({
            where: { id },
            data,
        });
        res.json({ project: updated });
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Project update failed' });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = String(req.params.id);
        const project = await db_1.prisma.project.findFirst({ where: { id, ownerId: userId } });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        await db_1.prisma.project.delete({ where: { id } });
        res.json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
exports.deleteProject = deleteProject;
