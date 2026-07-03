const { getClientIp } = require('../utils/loginSecurity');

const store = new Map();

const pruneExpired = (key, windowMs) => {
  const entry = store.get(key);
  if (!entry) return;
  const cutoff = Date.now() - windowMs;
  entry.hits = entry.hits.filter((time) => time > cutoff);
  if (!entry.hits.length) store.delete(key);
};

const createRateLimiter = ({ windowMs, max, message, keyGenerator }) => (req, res, next) => {
  const key = keyGenerator(req);
  pruneExpired(key, windowMs);
  const entry = store.get(key) || { hits: [] };
  entry.hits = entry.hits.filter((time) => time > Date.now() - windowMs);
  if (entry.hits.length >= max) {
    return res.status(429).json(typeof message === 'string' ? { message } : message);
  }
  entry.hits.push(Date.now());
  store.set(key, entry);
  next();
};

const getAllowedIps = () => (process.env.ADMIN_ALLOWED_IPS || '').split(',').map((ip) => ip.trim()).filter(Boolean);

const isIpAllowed = (req) => {
  const allowed = getAllowedIps();
  if (!allowed.length) return true;
  const clientIp = getClientIp(req);
  return allowed.some((ip) => clientIp === ip || clientIp.endsWith(ip));
};

const ipAllowlist = (req, res, next) => {
  if (isIpAllowed(req)) return next();
  return res.status(403).json({ message: 'Access denied from this network.' });
};

const verifyAdminAccessKey = (req, res, next) => {
  const requiredKey = process.env.ADMIN_ACCESS_KEY;
  if (!requiredKey) return next();
  const providedKey = req.header('X-Admin-Access-Key') || req.body?.accessKey;
  if (providedKey && providedKey === requiredKey) return next();
  return res.status(403).json({ message: 'Invalid admin access key.' });
};

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.LOGIN_RATE_LIMIT, 10) || 100,
  keyGenerator: (req) => `login:${getClientIp(req)}`,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

const accessKeyRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.ACCESS_KEY_RATE_LIMIT, 10) || 100,
  keyGenerator: (req) => `access:${getClientIp(req)}`,
  message: { message: 'Too many access attempts. Please try again later.' },
});

const adminApiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.ADMIN_API_RATE_LIMIT, 10) || 200,
  keyGenerator: (req) => `admin:${req.user?._id || getClientIp(req)}`,
  message: { message: 'Too many admin requests. Please slow down.' },
});

module.exports = { ipAllowlist, verifyAdminAccessKey, loginRateLimiter, accessKeyRateLimiter, adminApiRateLimiter };
