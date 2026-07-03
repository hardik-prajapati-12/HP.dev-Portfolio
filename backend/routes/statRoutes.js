const router = require('express').Router();
const { getStats, createStat, updateStat, deleteStat } = require('../controllers/statController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getStats);
router.post('/', auth, adminOnly, createStat);
router.put('/:id', auth, adminOnly, updateStat);
router.delete('/:id', auth, adminOnly, deleteStat);

module.exports = router;
