const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  s3Key: String,
});

module.exports = mongoose.model('Image', imageSchema);
