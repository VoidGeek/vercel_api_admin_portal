const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/demo");
const projectController = require("../controllers/project.controller");
const checkAdminPermission = require("../middlewares/projectPermission");
const multer = require('multer');


// Create a new project (POST)


router.post("/api/projects",  projectController.createProject,);

// Get all projects (GET)
router.get("/api/projects", projectController.getAllProjects);

// Get a specific project by ID (GET)

router.get("/api/projects/:id", projectController.getAllProjects);
// Update a project by ID (PUT)
router.put("/api/projects/:id", projectController.updateProject);

// Delete a project by ID (DELETE)
router.delete("/api/projects/:id",  projectController.deleteProject);
module.exports = router;