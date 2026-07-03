const mongoose = require('mongoose');

const projectCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: [50, 'Category Name cannot exceed 50 characters']
  },
  color: {
    type: String,
    default: '#6366F1',
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectCategory', projectCategorySchema);
