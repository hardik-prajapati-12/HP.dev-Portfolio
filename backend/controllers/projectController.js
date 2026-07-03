const Project = require('../models/Project');
const ProjectCategory = require('../models/ProjectCategory');

// GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (featured) filter.featured = featured === 'true';
    
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const validateProjectData = (data) => {
  const { title, technologies, features, description, caseStudy, status, date } = data;
  if (!title || title.trim().length === 0) {
    return 'Project Title is required';
  }
  if (title.trim().length > 100) {
    return 'Project Title cannot exceed 100 characters';
  }
  if (status && status.length > 50) {
    return 'Status cannot exceed 50 characters';
  }
  if (date && date.length > 50) {
    return 'Date/Timeline cannot exceed 50 characters';
  }

  const techStr = Array.isArray(technologies) ? technologies.join(', ') : (technologies || '');
  if (techStr.length > 200) {
    return 'Technologies cannot exceed 200 characters';
  }

  const featuresStr = Array.isArray(features) ? features.join(', ') : (features || '');
  if (featuresStr.length > 1000) {
    return 'Key Features cannot exceed 1000 characters';
  }

  if (description && description.length > 300) {
    return 'Short Description cannot exceed 300 characters';
  }

  if (caseStudy) {
    const { title: csTitle, badge: csBadge, insight: csInsight } = caseStudy;
    if (csTitle && csTitle.length > 200) {
      return 'Case Study Title cannot exceed 200 characters';
    }
    if (csBadge && csBadge.length > 100) {
      return 'Case Study Badge cannot exceed 100 characters';
    }
    if (csInsight && csInsight.length > 300) {
      return 'Live Project Insight cannot exceed 300 characters';
    }
  }

  return null;
};

// POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const errorMsg = validateProjectData(req.body);
    if (errorMsg) {
      return res.status(400).json({ message: errorMsg });
    }
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const errorMsg = validateProjectData(req.body);
    if (errorMsg) {
      return res.status(400).json({ message: errorMsg });
    }
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ── Project Category CRUD ──

exports.getProjectCategories = async (req, res) => {
  try {
    const categories = await ProjectCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createProjectCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Category Name is required' });
    }
    if (name.trim().length > 50) {
      return res.status(400).json({ message: 'Category Name cannot exceed 50 characters' });
    }
    const category = await ProjectCategory.create({ name: name.trim(), color: color || '#6366F1' });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
};

exports.updateProjectCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Category Name is required' });
    }
    if (name.trim().length > 50) {
      return res.status(400).json({ message: 'Category Name cannot exceed 50 characters' });
    }

    const category = await ProjectCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const oldName = category.name;
    const newName = name.trim();

    // Check if new name already exists (excluding this document)
    const duplicate = await ProjectCategory.findOne({ name: newName, _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    category.name = newName;
    if (color) category.color = color;
    await category.save();

    // Update all matching projects to the new category name
    await Project.updateMany({ category: oldName }, { category: newName });

    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

exports.deleteProjectCategory = async (req, res) => {
  try {
    const category = await ProjectCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Update all matching projects to "Uncategorized"
    await Project.updateMany({ category: category.name }, { category: 'Uncategorized' });

    await ProjectCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
