const router = require('express').Router();
const { body } = require('express-validator');
const { submitContact, getMessages, markAsRead, deleteMessage, replyMessage } = require('../controllers/contactController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
], validate, submitContact);

router.get('/', auth, adminOnly, getMessages);
router.put('/:id/read', auth, adminOnly, markAsRead);
router.delete('/:id', auth, adminOnly, deleteMessage);
router.post('/:id/reply', auth, adminOnly, replyMessage);

module.exports = router;
