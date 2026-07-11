const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const Tag = require('../models/Tag');
const BlogCategory = require('../models/BlogCategory');
const User = require('../models/User');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/blogs
exports.getBlogs = async (req, res, next) => {
  try {
    // Auto-publish any scheduled blogs whose time has arrived
    await Blog.updateMany(
      { status: 'scheduled', scheduledAt: { $lte: new Date() } },
      { $set: { status: 'published' } }
    );

    const { category, search, published, status, tag } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [new RegExp(`^${escapeRegex(tag)}$`, 'i')] };
    
    if (published === 'all') {
      // Admin view: return all statuses (draft, published, scheduled)
    } else if (status) {
      filter.status = status;
    } else {
      // Public view: only show published posts
      filter.status = 'published';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    
    const blogs = await Blog.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

// GET /api/blogs/:slug
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Auto-publish if scheduled time has arrived
    if (blog.status === 'scheduled' && blog.scheduledAt && new Date(blog.scheduledAt) <= new Date()) {
      blog.status = 'published';
      await blog.save();
    }

    // If the blog is not published (draft or scheduled), restrict access to admin users only
    if (blog.status !== 'published') {
      let isAdmin = false;
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id);
          if (user && user.role === 'admin') {
            isAdmin = true;
          }
        } catch (err) {
          // Token verification failed or user not found, treat as non-admin
        }
      }
      if (!isAdmin) {
        return res.status(404).json({ message: 'Blog not found' });
      }
    }

    blog.views += 1;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

exports.getBlogTags = async (req, res, next) => {
  try {
    const uniqueBlogTags = await Blog.distinct('tags');
    await Promise.all(uniqueBlogTags.map(async (t) => {
      if (t && t.trim() !== '') {
        await Tag.findOneAndUpdate(
          { name: new RegExp(`^${escapeRegex(t.trim())}$`, 'i') },
          { $setOnInsert: { name: t.trim().toLowerCase() } },
          { upsert: true, new: true }
        );
      }
    }));

    const allTags = await Tag.find().sort({ name: 1 });
    const blogTags = await Blog.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ]);
    
    const countMap = {};
    blogTags.forEach(bt => {
      countMap[bt._id.toLowerCase()] = bt.count;
    });
    
    const result = allTags.map(t => {
      return {
        tag: t.name.toLowerCase(),
        count: countMap[t.name.toLowerCase()] || 0
      };
    });
    
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.removeTagFromAllBlogs = async (req, res, next) => {
  try {
    const { tag } = req.body;
    if (!tag) return res.status(400).json({ message: 'Tag is required' });

    await Tag.deleteOne({ name: new RegExp(`^${escapeRegex(tag)}$`, 'i') });

    const tagRegex = new RegExp(`^${escapeRegex(tag)}$`, 'i');
    const blogs = await Blog.find({ tags: { $in: [tagRegex] } });
    await Promise.all(blogs.map(async (blog) => {
      blog.tags = blog.tags.filter((existingTag) => existingTag.toLowerCase() !== tag.toLowerCase());
      await blog.save();
    }));

    res.json({ success: true, message: `Removed tag '${tag}' globally` });
  } catch (error) {
    next(error);
  }
};

exports.renameTag = async (req, res, next) => {
  try {
    const { oldTag, newTag } = req.body;
    if (!oldTag || !newTag) {
      return res.status(400).json({ message: 'Both oldTag and newTag are required' });
    }

    await Tag.findOneAndUpdate(
      { name: new RegExp(`^${escapeRegex(oldTag)}$`, 'i') },
      { name: newTag.trim().toLowerCase() }
    );

    const oldTagRegex = new RegExp(`^${escapeRegex(oldTag)}$`, 'i');
    const blogs = await Blog.find({ tags: { $in: [oldTagRegex] } });

    await Promise.all(blogs.map(async (blog) => {
      let updated = false;
      const lowerNewTag = newTag.trim().toLowerCase();
      const hasNewTag = blog.tags.some(t => t.toLowerCase() === lowerNewTag);

      blog.tags = blog.tags.map(t => {
        if (t.toLowerCase() === oldTag.toLowerCase()) {
          updated = true;
          return hasNewTag ? null : newTag.trim().toLowerCase();
        }
        return t.toLowerCase();
      }).filter(Boolean);

      if (updated) {
        await blog.save();
      }
    }));

    res.json({ success: true, message: `Renamed tag '${oldTag}' to '${newTag.trim().toLowerCase()}'` });
  } catch (error) {
    next(error);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const { tag } = req.body;
    if (!tag || tag.trim() === '') {
      return res.status(400).json({ message: 'Tag name is required' });
    }

    const exists = await Tag.findOne({ name: new RegExp(`^${escapeRegex(tag.trim())}$`, 'i') });
    if (exists) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    const newTagDoc = await Tag.create({ name: tag.trim().toLowerCase() });
    res.status(201).json({ success: true, data: newTagDoc });
  } catch (error) {
    next(error);
  }
};

const validateBlogData = async (data) => {
  const { title, tags, excerpt, category } = data;

  if (title && title.trim().length > 500) {
    return 'Title cannot exceed 500 characters';
  }

  if (tags) {
    if (typeof tags === 'string') {
      data.tags = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      data.tags = tags.map(t => t.trim().toLowerCase()).filter(Boolean);
    }
    const tagsStr = data.tags.join(', ');
    if (tagsStr.length > 200) {
      return 'Tags cannot exceed 200 characters';
    }
  }

  if (excerpt && excerpt.trim().length > 300) {
    return 'Excerpt cannot exceed 300 characters';
  }

  if (category) {
    const categoryExists = await BlogCategory.findOne({ name: category.trim() });
    if (!categoryExists && category.trim() !== 'Uncategorized') {
      return 'Invalid Category selection';
    }
  }

  return null;
};

// POST /api/blogs
exports.createBlog = async (req, res, next) => {
  try {
    const validationError = await validateBlogData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Resolve category color from BlogCategory
    let resolvedColor = '#6366F1';
    if (req.body.category && req.body.category.trim() !== 'Uncategorized') {
      const catDoc = await BlogCategory.findOne({ name: req.body.category.trim() });
      if (catDoc) {
        resolvedColor = catDoc.color || '#6366F1';
      }
    }
    req.body.categoryColor = resolvedColor;

    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// PUT /api/blogs/:id
exports.updateBlog = async (req, res, next) => {
  try {
    const validationError = await validateBlogData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Resolve category color from BlogCategory
    let resolvedColor = '#6366F1';
    if (req.body.category && req.body.category.trim() !== 'Uncategorized') {
      const catDoc = await BlogCategory.findOne({ name: req.body.category.trim() });
      if (catDoc) {
        resolvedColor = catDoc.color || '#6366F1';
      }
    }
    req.body.categoryColor = resolvedColor;

    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/blogs/:id
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/blogs/:id/like
exports.likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.likes = (blog.likes || 0) + 1;
    await blog.save();
    res.json({ success: true, data: { likes: blog.likes } });
  } catch (error) {
    next(error);
  }
};

// --- Blog Category CRUD Controller Methods ---

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Category Name is required' });
    }
    if (name.trim().length > 50) {
      return res.status(400).json({ message: 'Category Name cannot exceed 50 characters' });
    }
    const category = await BlogCategory.create({ name: name.trim(), color: color || '#6366F1' });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Category Name is required' });
    }
    if (name.trim().length > 50) {
      return res.status(400).json({ message: 'Category Name cannot exceed 50 characters' });
    }

    const category = await BlogCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const oldName = category.name;
    const newName = name.trim();
    const newColor = color || '#6366F1';

    // Check if new name already exists in database (excluding this document)
    const duplicate = await BlogCategory.findOne({ name: newName, _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    category.name = newName;
    category.color = newColor;
    await category.save();

    // Update all matching blogs to the new category name and color
    await Blog.updateMany({ category: oldName }, { category: newName, categoryColor: newColor });

    res.json({ success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await BlogCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Update all matching blogs to "Uncategorized" and default color
    await Blog.updateMany({ category: category.name }, { category: 'Uncategorized', categoryColor: '#6366F1' });

    await BlogCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

