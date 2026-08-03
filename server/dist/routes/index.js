"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const projectController_1 = require("../controllers/projectController");
const diagramController_1 = require("../controllers/diagramController");
const templateController_1 = require("../controllers/templateController");
const exportController_1 = require("../controllers/exportController");
const authGuard_1 = require("../middleware/authGuard");
const router = (0, express_1.Router)();
// Auth Routes
router.post('/auth/register', authController_1.register);
router.post('/auth/login', authController_1.login);
router.post('/auth/refresh', authController_1.refreshToken);
router.post('/auth/logout', authController_1.logout);
router.get('/auth/me', authGuard_1.authGuard, authController_1.getMe);
// Project Routes
router.get('/projects', authGuard_1.authGuard, projectController_1.getProjects);
router.post('/projects', authGuard_1.authGuard, projectController_1.createProject);
router.get('/projects/:id', authGuard_1.authGuard, projectController_1.getProjectById);
router.put('/projects/:id', authGuard_1.authGuard, projectController_1.updateProject);
router.delete('/projects/:id', authGuard_1.authGuard, projectController_1.deleteProject);
// Diagram Routes
router.get('/diagrams/:projectId', authGuard_1.authGuard, diagramController_1.getDiagram);
router.put('/diagrams/:projectId', authGuard_1.authGuard, diagramController_1.saveDiagram);
router.post('/diagrams/validate', authGuard_1.authGuard, diagramController_1.validateDiagram);
// Template Routes
router.get('/templates', templateController_1.getTemplates);
// Export Routes
router.post('/export/markdown', authGuard_1.authGuard, exportController_1.exportMarkdownDocs);
router.post('/export/terraform', authGuard_1.authGuard, exportController_1.exportTerraform);
exports.default = router;
