const Achievement = require('../models/Achievement');

exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const validateAchievementData = async (data) => {
  const { title, value, icon } = data;

  if (!title || title.trim().length === 0) {
    return 'Achievement Title is required';
  }
  if (title.trim().length > 100) {
    return 'Achievement Title cannot exceed 100 characters';
  }

  if (!value || String(value).trim().length === 0) {
    return 'Value/Metric is required';
  }
  if (String(value).trim().length > 50) {
    return 'Value/Metric cannot exceed 50 characters';
  }

  if (icon) {
    if (!/^\p{Extended_Pictographic}$/u.test(icon)) {
      return 'Icon must be exactly one emoji';
    }
  }

  if (data.issuer) {
    if (data.issuer.trim().length > 100) {
      return 'Issuer cannot exceed 100 characters';
    }
  }

  if (data.skills) {
    if (data.skills.trim().length > 300) {
      return 'Skills Demonstrated cannot exceed 300 characters';
    }
  }

  return null;
};

exports.createAchievement = async (req, res) => {
  try {
    const validationError = await validateAchievementData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const achievement = await Achievement.create(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating achievement', error: error.message });
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const validationError = await validateAchievementData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json(achievement);
  } catch (error) {
    res.status(400).json({ message: 'Error updating achievement', error: error.message });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json({ message: 'Achievement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting achievement', error: error.message });
  }
};
