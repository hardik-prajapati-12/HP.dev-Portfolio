const router = require('express').Router();
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getTestimonials);
router.post('/', auth, adminOnly, createTestimonial);
router.put('/:id', auth, adminOnly, updateTestimonial);
router.delete('/:id', auth, adminOnly, deleteTestimonial);

module.exports = router;
