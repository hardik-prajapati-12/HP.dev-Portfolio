const router = require('express').Router();
const { postChat, getHistory, saveHistory } = require('../controllers/chatController');

router.post('/', postChat);
router.get('/history', getHistory);
router.post('/save', saveHistory);

module.exports = router;
