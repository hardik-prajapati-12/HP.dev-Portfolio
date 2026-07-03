const router = require('express').Router();
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getServices);
router.post('/', auth, adminOnly, createService);
router.put('/:id', auth, adminOnly, updateService);
router.delete('/:id', auth, adminOnly, deleteService);

module.exports = router;
