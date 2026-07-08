const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: [500, 'Title cannot exceed 500 characters'] },
  slug: { type: String, required: true, unique: true, lowercase: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true, maxlength: 300 },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  categoryColor: { type: String, default: '#6366F1' },
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        if (!v) return true;
        const joined = Array.isArray(v) ? v.join(', ') : String(v);
        return joined.length <= 200;
      },
      message: 'Tags cannot exceed 200 characters'
    }
  },
  author: { type: String, default: 'Admin' },
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'published' },
  scheduledAt: { type: Date, default: null },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

blogSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = this.tags.map(t => t.toLowerCase().trim()).filter(Boolean);
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
