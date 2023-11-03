const Testimonial = require("../models/testimonial.model");
const Image = require("../models/image.model")
// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { testimonial_text, user_name, occupation, company, rating, test_image} = req.body;

    // Ensure that req.userId is defined and contains the user's ID
    if (!req.userId) {
      return res.status(401).json({ message: "User is not authenticated." });
    }

    // Validate that all required fields are provided

    const adminUserId = req.userId; // Use req.userId to get the user's ID

    const testimonial = new Testimonial({
      testimonial_text,
      user_name,
      occupation,
      company,
      rating,
      adminUser: adminUserId,
      test_image,
    });

    await testimonial.save();

    res.status(201).json({ message: "Testimonial created successfully" });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a testimonial by ID
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json({ message: "Testimonial updated successfully" });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a testimonial by ID
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndRemove(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
