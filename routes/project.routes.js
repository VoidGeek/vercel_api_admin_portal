const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/demo");
const projectController = require("../controllers/project.controller");
const checkAdminPermission = require("../middlewares/projectPermission");
const multer = require('multer');


// Create a new project (POST)


router.post("/api/projects", [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole], projectController.createProject,);

// Get all projects (GET)
router.get("/api/projects", projectController.getAllProjects);

// Get a specific project by ID (GET)
router.get("/api/projects/:id", projectController.getProjectById);

// Update a project by ID (PUT)
router.put("/api/projects/:id", [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole], projectController.updateProject);

// Delete a project by ID (DELETE)
router.delete("/api/projects/:id", [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole,checkAdminPermission], projectController.deleteProject);
module.exports = router;