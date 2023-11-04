const express = require('express');
const router = express.Router();
const { authJwt } = require("../middlewares/demo");
const multer = require('multer');
const imageController = require('../controllers/imageController');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define routes for image operations
router.post('/upload', upload.single('image'), imageController.createImage);
router.get('/images', imageController.getImage);
router.get('/images/:s3Key', imageController.getImageById);
router.put('/images/:s3Key',  upload.single('image'),imageController.updatedImage);
router.delete('/images/:s3Key', imageController.deleteImage);

module.exports = router;
