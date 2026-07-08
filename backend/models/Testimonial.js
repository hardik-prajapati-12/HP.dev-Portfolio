const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  role: { type: String, required: true, maxlength: 50 },
  company: { type: String, default: '', maxlength: 100 },
  content: { type: String, required: true, maxlength: 300 },
  avatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  featured: { type: Boolean, default: false },
  color: { type: String, default: '#6366F1' },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
