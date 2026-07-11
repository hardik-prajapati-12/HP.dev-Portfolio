const router = require('express').Router();
const { getFaqs, createFaq, updateFaq, deleteFaq } = require('../controllers/chatbotFaqController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getFaqs);
router.post('/', auth, adminOnly, createFaq);
router.put('/:id', auth, adminOnly, updateFaq);
router.delete('/:id', auth, adminOnly, deleteFaq);

module.exports = router;
