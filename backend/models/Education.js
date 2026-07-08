const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { 
    type: String, 
    required: true, 
    trim: true,
    maxLength: [100, 'Degree/Qualification cannot exceed 100 characters']
  },
  institution: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: [100, 'Institution cannot exceed 100 characters']
  },
  year: { 
    type: String, 
    required: true,
    trim: true
  },
  grade: { 
    type: String, 
    default: '',
    trim: true,
    maxLength: [50, 'Grade cannot exceed 50 characters']
  },
  icon: { 
    type: String, 
    default: '🎓',
    validate: {
      validator: function(v) {
        return !v || /^\p{Extended_Pictographic}\uFE0F?$/u.test(v);
      },
      message: 'Icon must be exactly one emoji'
    }
  },
  image: { type: String, default: '' },
  color: { type: String, default: '#10B981' },
  order: { 
    type: Number, 
    default: 0,
    min: [0, 'Display Order cannot be negative'],
    max: [999, 'Display Order cannot exceed 999']
  },
  currentlyPursuing: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
