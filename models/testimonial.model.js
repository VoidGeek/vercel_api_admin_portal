const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  testimonial_text: {
    type: String,
  },
  user_name: {
    type: String,
  },
  rating: {
    type: Number,
    
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  occupation: {
    type: String,
    
  },
  company: {
    type: String,
    
  },
  adminUser: {
    type: String, // Store the admin's username as a string
// Make it a required field
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  test_image: 
    {
      type: String,
    },
});

testimonialSchema.pre("findOneAndUpdate", function () {
  this._update.updatedAt = new Date();
});


module.exports = mongoose.model("Testimonial", testimonialSchema);
