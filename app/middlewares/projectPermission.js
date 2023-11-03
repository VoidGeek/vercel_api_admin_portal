const Project = require("../models/project.model");

const projectPermission = async (req, res, next) => {
  const projectId = req.params.id; // Assuming project ID is in the request parameters

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the requesting user is the admin of the project
    if (project.adminUser !== req.userId) {
      return res.status(403).json({ message: "You are not authorized to perform this operation" });
    }

    // If the user is the admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking admin permission:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = projectPermission;
