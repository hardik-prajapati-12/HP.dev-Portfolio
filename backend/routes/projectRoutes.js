const router = require('express').Router();
const { body } = require('express-validator');
const { getProjects, getProject, createProject, updateProject, deleteProject, getProjectCategories, createProjectCategory, updateProjectCategory, deleteProjectCategory } = require('../controllers/projectController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const projectValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

router.get('/categories', getProjectCategories);
router.post('/categories', auth, adminOnly, createProjectCategory);
router.put('/categories/:id', auth, adminOnly, updateProjectCategory);
router.delete('/categories/:id', auth, adminOnly, deleteProjectCategory);

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', auth, adminOnly, projectValidation, validate, createProject);
router.put('/:id', auth, adminOnly, updateProject);
router.delete('/:id', auth, adminOnly, deleteProject);

module.exports = router;

