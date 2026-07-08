const LoginAttempt = require('../models/LoginAttempt');

const MAX_ATTEMPTS = parseInt(process.env.LOGIN_MAX_ATTEMPTS, 10) || 5;
const LOCKOUT_MINUTES = parseInt(process.env.LOGIN_LOCKOUT_MINUTES, 10) || 30;

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  const ip = req.ip || req.socket?.remoteAddress || '';
  return ip.replace('::ffff:', '');
};

const isLockedOut = async (ip, email) => {
  const record = await LoginAttempt.findOne({ ip, email: email.toLowerCase() });
  if (!record?.lockUntil) return null;
  if (record.lockUntil <= new Date()) {
    await LoginAttempt.deleteOne({ _id: record._id });
    return null;
  }
  return Math.ceil((record.lockUntil - new Date()) / 60000);
};

const recordFailedAttempt = async (ip, email) => {
  const normalizedEmail = email.toLowerCase();
  const record = await LoginAttempt.findOneAndUpdate(
    { ip, email: normalizedEmail },
    { $inc: { attempts: 1 }, $set: { lastAttempt: new Date() } },
    { upsert: true, new: true }
  );
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
    await record.save();
    return LOCKOUT_MINUTES;
  }
  return null;
};

const clearLoginAttempts = async (ip, email) => {
  await LoginAttempt.deleteOne({ ip, email: email.toLowerCase() });
};

module.exports = { getClientIp, isLockedOut, recordFailedAttempt, clearLoginAttempts };
