const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_cloudinary_api_key' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    if (isCloudinaryConfigured) {
      // Upload local temporary file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio_uploads',
        use_filename: true,
        unique_filename: true
      });

      // Cleanup local temp file
      const fs = require('fs');
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp upload file:', err);
      });

      return res.status(201).json({
        success: true,
        url: result.secure_url,
        filename: result.public_id,
      });
    }

    // Fallback to local uploads
    res.status(201).json({
      success: true,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};
