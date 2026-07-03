const Skill = require('../models/Skill');
const SkillCategory = require('../models/SkillCategory');

const validateSkillData = async (data) => {
  const { name, order, category } = data;

  if (!name || name.trim().length === 0) {
    return 'Skill Name is required';
  }
  if (name.trim().length > 50) {
    return 'Skill Name cannot exceed 50 characters';
  }

  if (!category || category.trim().length === 0) {
    return 'Category is required';
  }
  const categoryExists = await SkillCategory.findOne({ name: category.trim() });
  if (!categoryExists) {
    return 'Invalid Category selection';
  }

  if (order !== undefined && order !== null && order !== '') {
    const numericOrder = Number(order);
    if (isNaN(numericOrder) || numericOrder < 0 || numericOrder > 999) {
      return 'Display Order must be a number between 0 and 999';
    }
  }

  return null;
};

exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createSkill = async (req, res) => {
  try {
    const validationError = await validateSkillData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: 'Error creating skill', error: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const validationError = await validateSkillData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: 'Error updating skill', error: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill', error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await SkillCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Category Name is required' });
    }
    if (name.trim().length > 50) {
      return res.status(400).json({ message: 'Category Name cannot exceed 50 characters' });
    }
    const category = await SkillCategory.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Category Name is required' });
    }
    if (name.trim().length > 50) {
      return res.status(400).json({ message: 'Category Name cannot exceed 50 characters' });
    }

    const category = await SkillCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const oldName = category.name;
    const newName = name.trim();

    // Check if new name already exists in database (excluding this document)
    const duplicate = await SkillCategory.findOne({ name: newName, _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    category.name = newName;
    await category.save();

    // Update all matching skills to the new category name
    await Skill.updateMany({ category: oldName }, { category: newName });

    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await SkillCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Update all matching skills to "Uncategorized"
    await Skill.updateMany({ category: category.name }, { category: 'Uncategorized' });

    await SkillCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
