const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  service_name: {
    type: String,
    required: true,
  },
  service_info: {
    type: String,
    required: true,
  },
  benefits: {
    type: String,
    required: true,
  },
  adminUser: {
    type: String, // Store the admin's username as a string
    required: true, // Make it a required field
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  service_image: 
    {
      type: String,
    },
});

serviceSchema.pre("findOneAndUpdate", function () {
  this._update.updatedAt = new Date();
});

module.exports = mongoose.model("Service", serviceSchema);
