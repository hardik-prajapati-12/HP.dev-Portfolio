const router = require('express').Router();
const { getSettings, getPublicSettings, updateSettings, testSmtpConnection, getSystemInfo } = require('../controllers/settingController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, getSettings);
router.get('/public', getPublicSettings);
router.put('/', auth, adminOnly, updateSettings);
router.post('/test-smtp', auth, adminOnly, testSmtpConnection);
router.get('/system-info', auth, adminOnly, getSystemInfo);

module.exports = router;


