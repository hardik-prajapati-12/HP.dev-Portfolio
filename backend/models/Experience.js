const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxLength: [100, 'Job Title cannot exceed 100 characters']
  },
  company: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: [100, 'Company cannot exceed 100 characters']
  },
  type: { type: String, default: '-' },
  description: { 
    type: String, 
    default: '',
    maxLength: [300, 'Description cannot exceed 300 characters']
  },
  tech: [{ type: String }],
  icon: { type: String, default: '💼' },
  image: { type: String, default: '' },
  color: { type: String, default: '#6366F1' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
