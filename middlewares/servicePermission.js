const Service = require("../models/service.model");

const servicePermission = async (req, res, next) => {
  const serviceId = req.params.id; // Assuming service ID is in the request parameters
 

  try {
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Check if the requesting user is the admin of the service
    if (service.adminUser!== req.userId) {
      return res.status(403).json({ message: "You are not authorized to perform this operation" });
    }

    // If the user is the admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking admin permission:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = servicePermission;

