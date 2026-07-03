const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxLength: [50, 'Skill Name cannot exceed 50 characters']
  },
  level: { type: Number, min: 0, max: 100, default: 100 },
  image: { type: String, default: '' },
  order: { 
    type: Number, 
    default: 0,
    min: [0, 'Display Order cannot be negative'],
    max: [999, 'Display Order cannot exceed 999']
  },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
