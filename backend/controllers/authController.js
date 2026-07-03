const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const User = require('../models/User');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');
const { getClientIp, isLockedOut, recordFailedAttempt, clearLoginAttempts } = require('../utils/loginSecurity');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.verifyAccess = async (req, res) => {
  const requiredKey = process.env.ADMIN_ACCESS_KEY;
  if (!requiredKey) return res.json({ success: true, message: 'Access granted' });
  const providedKey = req.body?.accessKey || req.header('X-Admin-Access-Key');
  if (providedKey === requiredKey) return res.json({ success: true, message: 'Access granted' });
  return res.status(403).json({ message: 'Invalid admin access key.' });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = getClientIp(req);

    const lockedMinutes = await isLockedOut(ip, email);
    if (lockedMinutes) {
      return res.status(429).json({ message: `Account temporarily locked. Try again in ${lockedMinutes} minute(s).` });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const lockMinutes = await recordFailedAttempt(ip, email);
      if (lockMinutes) {
        return res.status(429).json({ message: `Too many failed attempts. Account locked for ${lockMinutes} minutes.` });
      }
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied.' });

    await clearLoginAttempts(ip, email);
    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true }).select('-password');
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// ─────────── FORGOT PASSWORD (Send OTP) ───────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.role !== 'admin') {
      // Don't reveal whether email exists — always return success
      return res.json({ message: 'If this email is registered, you will receive an OTP shortly.' });
    }

    // Rate-limit: only allow 1 OTP per 2 minutes per email
    const recentOtp = await Otp.findOne({ email: user.email, expiresAt: { $gt: new Date() } });
    if (recentOtp) {
      const secondsLeft = Math.ceil((recentOtp.expiresAt - Date.now()) / 1000);
      if (secondsLeft > 8 * 60) {
        // OTP was sent less than 2 minutes ago (10min expiry - 8min = 2min window)
        return res.status(429).json({ message: 'OTP already sent. Please wait before requesting a new one.' });
      }
    }

    // Always delete ALL previous OTPs for this email before creating a new one
    await Otp.deleteMany({ email: user.email });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP (plain text for verification, 10 min expiry)
    await Otp.create({
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send OTP email
    const logoPath = path.resolve(__dirname, '../../frontend/src/assets/logo.png');
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0F172A; border-radius: 16px; color: #E2E8F0;">
        <div style="text-align: center; margin-bottom: 28px;">
          <img src="cid:hpdev-logo" alt="HP.dev" style="height: 100px; display: block; margin: 0 auto 8px;" />
          <h2 style="color: #F1F5F9; margin: 0 0 4px; font-size: 1.4rem;">Password Reset</h2>
        </div>
        <p style="color: #CBD5E1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">
          You requested a password reset. Use the OTP below to verify your identity. This code expires in <strong style="color: #6366F1;">10 minutes</strong>.
        </p>
        <div style="text-align: center; padding: 20px; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); border-radius: 12px; margin-bottom: 24px;">
          <span style="font-size: 2.2rem; font-weight: 800; letter-spacing: 8px; color: #6366F1;">${otp}</span>
        </div>
        <p style="color: #94A3B8; font-size: 0.82rem; line-height: 1.5; margin-bottom: 24px;">
          If you did not request this, you can safely ignore this email. Your account is secure.
        </p>
        <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; text-align: center;">
          <span style="color: #475569; font-size: 0.75rem;">Sent by HP.dev Portfolio</span>
        </div>
      </div>
    `;

    // Log to console for development convenience
    console.log(`[DEVELOPMENT] Password Reset OTP for ${user.email} is: ${otp}`);

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset OTP — HP.dev',
        html,
        attachments: [{
          filename: 'logo.png',
          path: logoPath,
          cid: 'hpdev-logo',
        }],
      });
    } catch (mailError) {
      console.error('SMTP Error:', mailError.message);
      // Return success but hint that check console is required (superb developer experience)
      return res.json({
        message: 'If this email is registered, you will receive an OTP shortly. (SMTP configuration issue detected; check server terminal console for OTP.)'
      });
    }

    res.json({ message: 'If this email is registered, you will receive an OTP shortly.' });
  } catch (error) {
    next(error);
  }
};

// ─────────── RESET PASSWORD (Verify OTP) ───────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase(), expiresAt: { $gt: new Date() } });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP has expired or is invalid. Please request a new one.' });
    }

    // Max 5 verification attempts
    if (otpRecord.attempts >= 5) {
      await Otp.deleteMany({ email: email.toLowerCase() });
      return res.status(429).json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = 5 - otpRecord.attempts;
      return res.status(400).json({ message: `Invalid OTP. ${remaining} attempt(s) remaining.` });
    }

    // OTP is valid — update password
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.password = newPassword;
    await user.save(); // pre-save hook will hash

    // Clean up all OTPs for this email
    await Otp.deleteMany({ email: email.toLowerCase() });

    res.json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    next(error);
  }
};

// ─────────── VERIFY OTP (without resetting password) ───────────
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const otpRecord = await Otp.findOne({ email: email.toLowerCase(), expiresAt: { $gt: new Date() } });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP has expired or is invalid. Please request a new one.' });
    }

    // Max 5 verification attempts
    if (otpRecord.attempts >= 5) {
      await Otp.deleteMany({ email: email.toLowerCase() });
      return res.status(429).json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = 5 - otpRecord.attempts;
      return res.status(400).json({ message: `Invalid OTP. ${remaining} attempt(s) remaining.` });
    }

    // OTP is valid — do NOT delete it yet (it will be consumed on password reset)
    res.json({ message: 'OTP verified successfully.', verified: true });
  } catch (error) {
    next(error);
  }
};
