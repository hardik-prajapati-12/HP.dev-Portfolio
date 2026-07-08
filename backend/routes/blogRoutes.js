const router = require('express').Router();
const { body } = require('express-validator');
const { 
  getBlogs, 
  getBlog, 
  createBlog, 
  updateBlog, 
  deleteBlog, 
  likeBlog, 
  getBlogTags, 
  removeTagFromAllBlogs, 
  renameTag, 
  createTag,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/blogController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const blogValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').notEmpty().withMessage('Excerpt is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

router.get('/tags', getBlogTags);
router.put('/remove-tag', auth, adminOnly, removeTagFromAllBlogs);
router.put('/rename-tag', auth, adminOnly, renameTag);
router.post('/create-tag', auth, adminOnly, createTag);

router.get('/categories', getCategories);
router.post('/categories', auth, adminOnly, createCategory);
router.put('/categories/:id', auth, adminOnly, updateCategory);
router.delete('/categories/:id', auth, adminOnly, deleteCategory);

router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/', auth, adminOnly, blogValidation, validate, createBlog);
router.put('/categories/:id', auth, adminOnly, updateCategory); // backup (redundant but matches route ordering nicely)
router.put('/:id', auth, adminOnly, updateBlog);
router.put('/:id/like', likeBlog);
router.delete('/:id', auth, adminOnly, deleteBlog);

module.exports = router;
