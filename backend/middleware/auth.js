const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getClientIp } = require('../utils/loginSecurity');

const getAllowedIps = () => (process.env.ADMIN_ALLOWED_IPS || '').split(',').map((ip) => ip.trim()).filter(Boolean);

const isIpAllowed = (req) => {
  const allowed = getAllowedIps();
  if (!allowed.length || allowed.includes('*')) return true;
  const clientIp = getClientIp(req);
  return allowed.some((ip) => clientIp === ip || clientIp.endsWith(ip));
};

const hasValidAccessKey = (req) => {
  const requiredKey = process.env.ADMIN_ACCESS_KEY;
  if (!requiredKey) return true;
  const providedKey = req.header('X-Admin-Access-Key');
  return providedKey && providedKey === requiredKey;
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Token is not valid' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  if (!isIpAllowed(req)) {
    return res.status(403).json({ message: 'Access denied from this network.' });
  }
  if (!hasValidAccessKey(req)) {
    return res.status(403).json({ message: 'Invalid admin access key.' });
  }
  next();
};

module.exports = { auth, adminOnly };
