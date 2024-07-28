const ImageModel = require('../models/image.model');
const multer = require('multer');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new aws.S3({
  accessKeyId: 'AKIAU6GD2OTDHRLCH2NZ',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

exports.createImage = async (req, res) => {
  const { buffer } = req.file;
  const submissionTime = new Date().getTime(); // Get the current timestamp in milliseconds
  const key = `${submissionTime}-${uuidv4()}`; // Generate a unique key using timestamp and uuid

  const params = {
    Bucket: 'deng39',
    Key: key,
    Body: buffer,
  };

  try {
    await s3.upload(params).promise();
    const imageUrl = s3.getSignedUrl('getObject', {
      Bucket: params.Bucket,
      Key: params.Key,
      Expires: 604800, // Set to one week (604800 seconds) to make the URL effectively never expire
    });

    const newImage = new ImageModel({
      name: key, // You can use the key as the name
      imageUrl,
      s3Key: key,
      // Save the S3 key in your MongoDB for reference
    });

    await newImage.save();

    res.status(201).json({ message: 'Image uploaded successfully', imageUrl, s3Key: key });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};


  
  // Image delete route
  exports.deleteImage = async (req, res) => {
    const s3Key = req.params.s3Key;
  
    if (!s3Key) {
      return res.status(400).json({ message: 'S3 key is missing' });
    }
  
    try {
      // Find and delete the image by the s3Key in MongoDB
      const deletedImage = await ImageModel.findOneAndDelete({ s3Key });
  
      if (!deletedImage) {
        return res.status(404).json({ message: 'Image not found in the database' });
      }
  
      res.json({ message: 'Image deleted from MongoDB successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete image from MongoDB' });
    }
  };
  
  
  
  // Image update route
  exports.updatedImage = async (req, res) => {
    const s3Key = req.params.s3Key;
  
    if (!s3Key) {
      return res.status(400).json({ message: 'S3 key is required' });
    }
  
    const newKey = `${uuidv4()}-${Date.now()}.jpg`; // Use the timestamp in the key
  
    try {
      // Delete the old object from S3
  
      // Upload the new object to S3
      const newParams = {
        Bucket: 'deng39',
        Key: newKey,
        Body: req.file.buffer, // Use req.file.buffer directly
      };
      await s3.upload(newParams).promise();
  
      // Update the MongoDB record with the new S3 key and URL
      const updatedImage = await ImageModel.findOneAndUpdate(
        { s3Key },
        {
          $set: {
            s3Key: newKey,
            imageUrl: s3.getSignedUrl('getObject', {
              Bucket: 'deng39',
              Key: newParams.Key,
              Expires: 604800,
            }),
          },
        },
        { new: true }
      );
  
      if (!updatedImage) {
        return res.status(404).json({ message: 'Image not found in the database' });
      }
  
      // Modify the response to include the new s3Key
      res.json({ message: 'Image updated successfully', s3Key: updatedImage.s3Key, imageUrl: updatedImage.imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update image' });
    }
  };
  
  
  
  // Get all images route
  exports.getImage = async (req, res) => {
    try {
      const images = await ImageModel.find();
      res.json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch images' });
    }
  };
  
  // Get an image by ID route
  exports.getImageById = async (req, res) => {
    const s3Key = req.params.s3Key;
  
    try {
      const image = await ImageModel.findOne({ s3Key: s3Key });
  
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      res.json(image);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch the image' });
    }
  };
  
