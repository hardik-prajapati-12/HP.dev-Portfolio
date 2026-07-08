const router = require('express').Router();
const { body } = require('express-validator');
const { login, getMe, updateProfile, verifyAccess, forgotPassword, resetPassword, verifyOtp } = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ipAllowlist, verifyAdminAccessKey, loginRateLimiter, accessKeyRateLimiter, adminApiRateLimiter } = require('../middleware/security');

router.post('/verify-access', accessKeyRateLimiter, ipAllowlist, verifyAccess);

router.post('/login', [
  loginRateLimiter,
  ipAllowlist,
  verifyAdminAccessKey,
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

router.post('/forgot-password', [
  loginRateLimiter,
  ipAllowlist,
  verifyAdminAccessKey,
  body('email').isEmail().withMessage('Valid email is required'),
], validate, forgotPassword);

router.post('/reset-password', [
  loginRateLimiter,
  ipAllowlist,
  verifyAdminAccessKey,
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, resetPassword);

router.post('/verify-otp', [
  loginRateLimiter,
  ipAllowlist,
  verifyAdminAccessKey,
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
], validate, verifyOtp);

router.get('/me', auth, adminOnly, adminApiRateLimiter, getMe);
router.put('/profile', auth, adminOnly, adminApiRateLimiter, updateProfile);

module.exports = router;
