const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Visitor = require('../models/Visitor');
const Setting = require('../models/Setting');

// GET /api/analytics/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalProjects,
      totalBlogs,
      totalMessages,
      totalVisitors,
      unreadMessages,
      uniqueVisitorsArr,
      todayVisitors,
      recentVisits,
      pageBreakdownRaw
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Visitor.countDocuments(),
      Contact.countDocuments({ read: false }),
      Visitor.distinct('ip'),
      Visitor.countDocuments({ createdAt: { $gte: startOfToday } }),
      Visitor.find({ createdAt: { $gte: fourteenDaysAgo } }).select('createdAt ip userAgent page').lean(),
      Visitor.aggregate([
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    const uniqueVisitors = uniqueVisitorsArr.length;

    // Build 14-day trend array using exact database timestamps
    const dateMap = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap[key] = { date: label, views: 0, ips: new Set() };
    }

    let desktopCount = 0;
    let mobileCount = 0;

    recentVisits.forEach(v => {
      if (v.createdAt) {
        const key = new Date(v.createdAt).toISOString().split('T')[0];
        if (dateMap[key]) {
          dateMap[key].views += 1;
          if (v.ip) dateMap[key].ips.add(v.ip);
        }
      }
      const ua = (v.userAgent || '').toLowerCase();
      if (/mobile|android|iphone|ipad|tablet/i.test(ua)) {
        mobileCount++;
      } else {
        desktopCount++;
      }
    });

    // Format 100% pure real trend list from MongoDB
    const visitorTrend = Object.values(dateMap).map(item => ({
      date: item.date,
      views: item.views,
      unique: item.ips.size
    }));

    const topPages = pageBreakdownRaw.map(p => ({
      page: p._id || '/',
      count: p.count
    }));

    const deviceBreakdown = [
      { name: 'Desktop', value: desktopCount },
      { name: 'Mobile / Tablet', value: mobileCount }
    ];

    res.json({
      totalProjects,
      totalBlogs,
      totalMessages,
      totalVisitors,
      uniqueVisitors,
      todayVisitors,
      unreadMessages,
      visitorTrend,
      topPages,
      deviceBreakdown
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/analytics/visit
exports.trackVisit = async (req, res, next) => {
  try {
    const settings = await Setting.findOne();
    if (settings && settings.enableVisitorLogging === false) {
      return res.json({ message: 'Visit tracking disabled by settings' });
    }

    const ip = req.headers['x-forwarded-for']
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : (req.ip || req.socket.remoteAddress || '127.0.0.1');

    await Visitor.create({
      ip,
      userAgent: req.headers['user-agent'] || '',
      page: req.body.page || '/',
      referrer: req.headers.referer || '',
    });
    res.json({ message: 'Visit tracked successfully' });
  } catch (error) {
    next(error);
  }
};
