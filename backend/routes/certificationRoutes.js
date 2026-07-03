const router = require('express').Router();
const { getCertifications, getCertificationById, createCertification, updateCertification, deleteCertification } = require('../controllers/certificationController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getCertifications);
router.get('/:id', getCertificationById);
router.post('/', auth, adminOnly, createCertification);
router.put('/:id', auth, adminOnly, updateCertification);
router.delete('/:id', auth, adminOnly, deleteCertification);

module.exports = router;
