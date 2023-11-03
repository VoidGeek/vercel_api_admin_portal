const Project = require("../models/project.model");

// Create a new project
// Create a new project
// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, project_image } = req.body;

    // Ensure that req.user is defined and contains the user's ID
    if (!req.userId) {
      return res.status(401).json({ message: "User is not authenticated." });
    }

    // Validate that all required fields are provided
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required for project creation." });
    }

    const adminUserId = req.userId; // Use req.userId to get the user's ID

    const project = new Project({
      title,
      description,
      startDate,
      endDate,
      adminUser: adminUserId,
      project_image, // Associate images with the project by passing an array of image IDs
    });

    await project.save();

    // Send the project details in the response
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Send the updated project details in the response
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




  
// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndRemove(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
