const Stat = require('../models/Stat');

const validateStatData = (data) => {
  const { label, value, suffix, icon, description, order } = data;

  if (!label || label.trim().length === 0) {
    return 'Stat Label is required';
  }
  if (label.trim().length > 100) {
    return 'Stat Label cannot exceed 100 characters';
  }

  if (value === undefined || value === null || value === '') {
    return 'Value is required';
  }
  const numericValue = Number(value);
  if (isNaN(numericValue) || numericValue < 0 || numericValue > 999) {
    return 'Value must be a number between 0 and 999';
  }

  if (suffix !== undefined && suffix !== null && suffix !== '') {
    if (suffix.length !== 1 || !/^[^\w\d\s]$/u.test(suffix) || /\p{Extended_Pictographic}/u.test(suffix)) {
      return 'Suffix must be a single symbol character (no letters, numbers, spaces, or emojis)';
    }
  }

  if (icon !== undefined && icon !== null && icon !== '') {
    if (!/^\p{Extended_Pictographic}$/u.test(icon)) {
      return 'Icon must be exactly one emoji';
    }
  }

  if (!description || description.trim().length === 0) {
    return 'Description is required';
  }
  if (description.trim().length > 200) {
    return 'Description cannot exceed 200 characters';
  }

  if (order !== undefined && order !== null && order !== '') {
    const numericOrder = Number(order);
    if (isNaN(numericOrder) || numericOrder < 0 || numericOrder > 999) {
      return 'Display Order must be a number between 0 and 999';
    }
  }

  return null;
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1, createdAt: 1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createStat = async (req, res) => {
  try {
    const validationError = validateStatData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const stat = await Stat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(400).json({ message: 'Error creating stat', error: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const validationError = validateStatData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const stat = await Stat.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!stat) return res.status(404).json({ message: 'Stat not found' });
    res.json(stat);
  } catch (error) {
    res.status(400).json({ message: 'Error updating stat', error: error.message });
  }
};

exports.deleteStat = async (req, res) => {
  try {
    const stat = await Stat.findByIdAndDelete(req.params.id);
    if (!stat) return res.status(404).json({ message: 'Stat not found' });
    res.json({ message: 'Stat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stat', error: error.message });
  }
};
