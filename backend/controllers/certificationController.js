const Certification = require('../models/Certification');

exports.getCertifications = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    const certifications = await Certification.find(filter).sort({ date: -1 });
    res.json(certifications);
  } catch (error) {
    next(error);
  }
};

exports.getCertificationById = async (req, res, next) => {
  try {
    const certification = await Certification.findById(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification not found' });
    res.json(certification);
  } catch (error) {
    next(error);
  }
};

const validateCertificationData = async (data) => {
  const { title, issuer, badge, skills } = data;

  if (!title || title.trim().length === 0) {
    return 'Certification Title is required';
  }
  if (title.trim().length > 100) {
    return 'Certification Title cannot exceed 100 characters';
  }

  if (!issuer || issuer.trim().length === 0) {
    return 'Issuer is required';
  }
  if (issuer.trim().length > 100) {
    return 'Issuer cannot exceed 100 characters';
  }

  if (badge) {
    if (!/^\p{Extended_Pictographic}$/u.test(badge)) {
      return 'Badge Icon must be exactly one emoji';
    }
  }

  if (skills && skills.trim().length > 200) {
    return 'Skills Learned cannot exceed 200 characters';
  }

  return null;
};

exports.createCertification = async (req, res, next) => {
  try {
    const validationError = await validateCertificationData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const certification = await Certification.create(req.body);
    res.status(201).json(certification);
  } catch (error) {
    next(error);
  }
};

exports.updateCertification = async (req, res, next) => {
  try {
    const validationError = await validateCertificationData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!certification) return res.status(404).json({ message: 'Certification not found' });
    res.json(certification);
  } catch (error) {
    next(error);
  }
};

exports.deleteCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) return res.status(404).json({ message: 'Certification not found' });
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    next(error);
  }
};
