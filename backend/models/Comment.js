const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  content: { type: String, required: true, trim: true },
  approved: { type: Boolean, default: false },
  commenterToken: { type: String, required: true },
  userAgent: { type: String },
  ip: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
