const router = require('express').Router();
const { getAchievements, getAchievementById, createAchievement, updateAchievement, deleteAchievement } = require('../controllers/achievementController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getAchievements);
router.get('/:id', getAchievementById);
router.post('/', auth, adminOnly, createAchievement);
router.put('/:id', auth, adminOnly, updateAchievement);
router.delete('/:id', auth, adminOnly, deleteAchievement);

module.exports = router;
