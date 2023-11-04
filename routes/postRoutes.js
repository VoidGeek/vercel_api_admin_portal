const express = require('express');
const router = express.Router();
const postPermission = require("../middlewares/postPermission");
const postController = require('../controllers/postController');
const { authJwt } = require("../middlewares");
// Create a new post
router.post('/api/posts', postController.createPost);

// Get all posts
router.get('/api/posts', postController.getAllPosts);

// Get a single post by ID
router.get('/api/posts/:id', postController.getPostById);

// Update a post by ID
router.put('/api/posts/:id', postController.updatePost);

// Delete a post by ID
router.delete('/api/posts/:id', postController.deletePost);

module.exports = router;
