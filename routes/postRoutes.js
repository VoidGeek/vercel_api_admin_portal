const express = require('express');
const router = express.Router();
const postPermission = require("../middlewares/postPermission");
const postController = require('../controllers/postController');
const { authJwt } = require("../middlewares/demo");
// Create a new post
router.post('/api/posts', [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole], postController.createPost);

// Get all posts
router.get('/api/posts', postController.getAllPosts);

// Get a single post by ID
router.get('/api/posts/:id', postController.getPostById);

// Update a post by ID
router.put('/api/posts/:id', [authJwt.verifyToken, authJwt.hasAdminOrModeratorRole], postController.updatePost);

// Delete a post by ID
router.delete('/api/posts/:id',[authJwt.verifyToken, authJwt.hasAdminOrModeratorRole,postPermission], postController.deletePost);


module.exports = router;
