const Service = require("../models/service.model");

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { service_name, service_info, benefits, service_image } = req.body;

    // Ensure that req.userId is defined and contains the user's ID
    if (!req.userId) {
      return res.status(401).json({ message: "User is not authenticated." });
    }

    // Validate that all required fields are provided
    if (!service_name || !service_info || !benefits ) {
      return res.status(400).json({ message: "All fields are required for service creation." });
    }

    const adminUserId = req.userId; // Use req.userId to get the user's ID

    const service = new Service({
      service_name,
      service_info,
      benefits,
      adminUser: adminUserId,
      service_image,
    });

    const savedService = await service.save();

    res.status(201).json({ message: "Service created successfully", data: savedService });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a service by ID
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service updated successfully", data: service });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a service by ID

// Delete a service by ID
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndRemove(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
