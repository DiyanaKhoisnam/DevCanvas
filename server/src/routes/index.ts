import { Router } from 'express';
import { register, login, refreshToken, logout, getMe } from '../controllers/authController';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { getDiagram, saveDiagram, validateDiagram } from '../controllers/diagramController';
import { getTemplates } from '../controllers/templateController';
import { exportMarkdownDocs, exportTerraform } from '../controllers/exportController';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refreshToken);
router.post('/auth/logout', logout);
router.get('/auth/me', authGuard, getMe);

// Project Routes
router.get('/projects', authGuard, getProjects);
router.post('/projects', authGuard, createProject);
router.get('/projects/:id', authGuard, getProjectById);
router.put('/projects/:id', authGuard, updateProject);
router.delete('/projects/:id', authGuard, deleteProject);

// Diagram Routes
router.get('/diagrams/:projectId', authGuard, getDiagram);
router.put('/diagrams/:projectId', authGuard, saveDiagram);
router.post('/diagrams/validate', authGuard, validateDiagram);

// Template Routes
router.get('/templates', getTemplates);

// Export Routes
router.post('/export/markdown', authGuard, exportMarkdownDocs);
router.post('/export/terraform', authGuard, exportTerraform);

export default router;
