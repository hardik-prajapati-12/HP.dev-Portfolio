const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getProfile);
router.put('/', auth, adminOnly, updateProfile);

module.exports = router;
