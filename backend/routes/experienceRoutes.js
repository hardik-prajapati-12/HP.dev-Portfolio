const router = require('express').Router();
const { 
  getExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience,
  getTypes,
  createType,
  updateType,
  deleteType 
} = require('../controllers/experienceController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getExperiences);
router.get('/types', getTypes);

router.post('/', auth, adminOnly, createExperience);
router.post('/types', auth, adminOnly, createType);

router.put('/types/:id', auth, adminOnly, updateType);
router.put('/:id', auth, adminOnly, updateExperience);

router.delete('/types/:id', auth, adminOnly, deleteType);
router.delete('/:id', auth, adminOnly, deleteExperience);

module.exports = router;
