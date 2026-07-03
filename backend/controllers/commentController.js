const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }).populate('blogId', 'title slug');
    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

exports.getCommentsForBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const requesterToken = req.header('X-Commenter-Token');

    const filter = { blogId };
    if (requesterToken) {
      filter.$or = [
        { approved: true },
        { commenterToken: requesterToken },
      ];
    } else {
      filter.approved = true;
    }

    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    const response = comments.map((comment) => {
      const obj = comment.toObject();
      obj.isOwner = requesterToken && requesterToken === comment.commenterToken;
      delete obj.commenterToken;
      return obj;
    });
    res.json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { blogId, name, email, content, commenterToken } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comment = await Comment.create({
      blogId,
      name,
      email,
      content,
      commenterToken,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip,
      approved: false,
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

exports.approveComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    comment.approved = req.body.approved !== undefined ? req.body.approved : true;
    await comment.save();

    res.json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    let isAdmin = false;
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('role');
        if (user?.role === 'admin') {
          isAdmin = true;
        }
      } catch (authErr) {
        isAdmin = false;
      }
    }

    if (!isAdmin) {
      const requesterToken = req.header('X-Commenter-Token') || req.body.commenterToken;
      if (!requesterToken || requesterToken !== comment.commenterToken) {
        return res.status(403).json({ message: 'Permission denied' });
      }
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
