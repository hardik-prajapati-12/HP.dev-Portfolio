const Experience = require('../models/Experience');
const ExperienceType = require('../models/ExperienceType');

exports.getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const validateExperienceData = async (data) => {
  const { title, company, tech, description, type } = data;

  if (!title || title.trim().length === 0) {
    return 'Job Title is required';
  }
  if (title.trim().length > 100) {
    return 'Job Title cannot exceed 100 characters';
  }

  if (!company || company.trim().length === 0) {
    return 'Company is required';
  }
  if (company.trim().length > 100) {
    return 'Company cannot exceed 100 characters';
  }

  if (type && type !== '-') {
    const typeExists = await ExperienceType.findOne({ name: type.trim() });
    if (!typeExists) {
      return 'Invalid Experience Type selection';
    }
  }

  const techStr = typeof tech === 'string' ? tech : (Array.isArray(tech) ? tech.join(', ') : '');
  if (techStr.length > 150) {
    return 'Technologies cannot exceed 150 characters';
  }

  if (description && description.trim().length > 300) {
    return 'Description cannot exceed 300 characters';
  }

  return null;
};

exports.createExperience = async (req, res) => {
  try {
    const validationError = await validateExperienceData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const payload = { ...req.body };
    if (!payload.type) {
      payload.type = '-';
    }
    if (typeof payload.tech === 'string') {
      payload.tech = payload.tech.split(',').map(t => t.trim()).filter(Boolean);
    }
    const experience = await Experience.create(payload);
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({ message: 'Error creating experience', error: error.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const validationError = await validateExperienceData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const payload = { ...req.body };
    if (!payload.type) {
      payload.type = '-';
    }
    if (typeof payload.tech === 'string') {
      payload.tech = payload.tech.split(',').map(t => t.trim()).filter(Boolean);
    }
    const experience = await Experience.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!experience) return res.status(404).json({ message: 'Experience not found' });
    res.json(experience);
  } catch (error) {
    res.status(400).json({ message: 'Error updating experience', error: error.message });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Experience not found' });
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting experience', error: error.message });
  }
};

// --- Experience Type Controller Methods ---

exports.getTypes = async (req, res) => {
  try {
    const types = await ExperienceType.find().sort({ name: 1 });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Type Name is required' });
    }
    if (name.trim().length > 50) {
      return res.status(400).json({ message: 'Type Name cannot exceed 50 characters' });
    }
    const type = await ExperienceType.create({ name: name.trim() });
    res.status(201).json(type);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Type already exists' });
    }
    res.status(400).json({ message: 'Error creating type', error: error.message });
  }
};

exports.updateType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Type Name is required' });
    }
    if (name.trim().length > 50) {
      return res.status(400).json({ message: 'Type Name cannot exceed 50 characters' });
    }

    const type = await ExperienceType.findById(req.params.id);
    if (!type) {
      return res.status(404).json({ message: 'Type not found' });
    }

    const oldName = type.name;
    const newName = name.trim();

    // Check if new name already exists in database (excluding this document)
    const duplicate = await ExperienceType.findOne({ name: newName, _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ message: 'Type name already exists' });
    }

    type.name = newName;
    await type.save();

    // Update all matching experiences to the new type name
    await Experience.updateMany({ type: oldName }, { type: newName });

    res.json({ message: 'Type updated successfully', type });
  } catch (error) {
    res.status(500).json({ message: 'Error updating type', error: error.message });
  }
};

exports.deleteType = async (req, res) => {
  try {
    const type = await ExperienceType.findById(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type not found' });

    // Update all matching experiences to "-"
    await Experience.updateMany({ type: type.name }, { type: '-' });

    await ExperienceType.findByIdAndDelete(req.params.id);
    res.json({ message: 'Type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting type', error: error.message });
  }
};
