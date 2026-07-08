const router = require('express').Router();
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');
const { auth, adminOnly } = require('../middleware/auth');
const { adminApiRateLimiter } = require('../middleware/security');

router.post('/', auth, adminOnly, adminApiRateLimiter, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return next(err);
    uploadImage(req, res, next);
  });
});

module.exports = router;
