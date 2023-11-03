const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  fullName: String,    // Add full name field
  phoneNo: String,     // Add phone number field
  createdAt: {
    type: Date,
    default: Date.now, // Add created at field with default value set to current date
  },
  user_image: 
    {
      type: String,
    },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
