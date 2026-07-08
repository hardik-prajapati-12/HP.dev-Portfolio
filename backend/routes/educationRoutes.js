const router = require('express').Router();
const { getEducations, createEducation, updateEducation, deleteEducation } = require('../controllers/educationController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getEducations);
router.post('/', auth, adminOnly, createEducation);
router.put('/:id', auth, adminOnly, updateEducation);
router.delete('/:id', auth, adminOnly, deleteEducation);

module.exports = router;
