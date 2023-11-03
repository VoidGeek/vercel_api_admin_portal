const Post = require("../models/post.model"); // Replace with the actual Post model

const postPermission = async (req, res, next) => {
  const postId = req.params.id; // Assuming post ID is in the request parameters

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the requesting user is the author of the post
    if (post.adminUser!== req.userId) {
      return res.status(403).json({ message: "You are not authorized to perform this operation" });
    }

    // If the user is the author, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking post permission:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = postPermission;
