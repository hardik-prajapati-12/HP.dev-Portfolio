const router = require('express').Router();
const { getSkills, createSkill, updateSkill, deleteSkill, getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/skillController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getSkills);
router.post('/', auth, adminOnly, createSkill);
router.put('/:id', auth, adminOnly, updateSkill);
router.delete('/:id', auth, adminOnly, deleteSkill);

router.get('/categories', getCategories);
router.post('/categories', auth, adminOnly, createCategory);
router.put('/categories/:id', auth, adminOnly, updateCategory);
router.delete('/categories/:id', auth, adminOnly, deleteCategory);

module.exports = router;
