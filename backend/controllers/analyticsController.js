const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Visitor = require('../models/Visitor');
const Setting = require('../models/Setting');

// GET /api/analytics/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const [totalProjects, totalBlogs, totalMessages, totalVisitors, unreadMessages] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Visitor.countDocuments(),
      Contact.countDocuments({ read: false }),
    ]);

    res.json({
      totalProjects,
      totalBlogs,
      totalMessages,
      totalVisitors,
      unreadMessages,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/analytics/visit
exports.trackVisit = async (req, res, next) => {
  try {
    // Check if visitor tracking is disabled in settings
    const settings = await Setting.findOne();
    if (settings && settings.enableVisitorLogging === false) {
      return res.json({ message: 'Visit tracking disabled by settings' });
    }

    await Visitor.create({
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      page: req.body.page || '/',
      referrer: req.headers.referer || '',
    });
    res.json({ message: 'Visit tracked' });
  } catch (error) {
    next(error);
  }
};

