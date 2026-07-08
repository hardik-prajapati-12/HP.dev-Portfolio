const Education = require('../models/Education');

const validateEducationData = async (data, currentId = null) => {
  const { degree, institution, year, grade, icon, order } = data;

  if (!degree || degree.trim().length === 0) {
    return 'Degree/Qualification is required';
  }
  if (degree.trim().length > 100) {
    return 'Degree/Qualification cannot exceed 100 characters';
  }

  if (!institution || institution.trim().length === 0) {
    return 'Institution is required';
  }
  if (institution.trim().length > 100) {
    return 'Institution cannot exceed 100 characters';
  }

  if (!year || year.trim().length === 0) {
    return 'Year is required';
  }

  // Check for duplicate year in database
  const query = { year: year.trim() };
  if (currentId) {
    query._id = { $ne: currentId };
  }
  const duplicate = await Education.findOne(query);
  if (duplicate) {
    return 'An education entry for this year already exists';
  }

  if (grade && grade.trim().length > 50) {
    return 'Grade cannot exceed 50 characters';
  }

  if (icon) {
    if (!/^\p{Extended_Pictographic}$/u.test(icon)) {
      return 'Icon must be exactly one emoji';
    }
  }

  if (order !== undefined && order !== null && order !== '') {
    const numericOrder = Number(order);
    if (isNaN(numericOrder) || numericOrder < 0 || numericOrder > 999) {
      return 'Display Order must be a number between 0 and 999';
    }
  }

  return null;
};

exports.getEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createEducation = async (req, res) => {
  try {
    const validationError = await validateEducationData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const education = await Education.create(req.body);
    res.status(201).json(education);
  } catch (error) {
    res.status(400).json({ message: 'Error creating education', error: error.message });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const validationError = await validateEducationData(req.body, req.params.id);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!education) return res.status(404).json({ message: 'Education not found' });
    res.json(education);
  } catch (error) {
    res.status(400).json({ message: 'Error updating education', error: error.message });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) return res.status(404).json({ message: 'Education not found' });
    res.json({ message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting education', error: error.message });
  }
};
