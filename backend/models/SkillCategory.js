const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: [50, 'Category Name cannot exceed 50 characters']
  }
}, { timestamps: true });

module.exports = mongoose.model('SkillCategory', skillCategorySchema);
