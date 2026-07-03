const router = require('express').Router();
const { getDashboard, trackVisit } = require('../controllers/analyticsController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/dashboard', auth, adminOnly, getDashboard);
router.post('/visit', trackVisit);

module.exports = router;
