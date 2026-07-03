const router = require('express').Router();
const { body } = require('express-validator');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getAllComments,
  getCommentsForBlog,
  createComment,
  approveComment,
  deleteComment,
} = require('../controllers/commentController');

router.get('/', auth, adminOnly, getAllComments);
router.get('/blog/:blogId', getCommentsForBlog);
router.post(
  '/',
  [
    body('blogId').notEmpty().withMessage('Blog ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('content').notEmpty().withMessage('Comment text is required'),
    body('commenterToken').notEmpty().withMessage('Commenter token is required'),
  ],
  validate,
  createComment
);
router.put('/:id', auth, adminOnly, approveComment);
router.delete('/:id', deleteComment);

module.exports = router;
