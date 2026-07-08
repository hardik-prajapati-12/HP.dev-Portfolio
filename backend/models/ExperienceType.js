const mongoose = require('mongoose');

const experienceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: [50, 'Type Name cannot exceed 50 characters']
  }
}, { timestamps: true });

module.exports = mongoose.model('ExperienceType', experienceTypeSchema);
