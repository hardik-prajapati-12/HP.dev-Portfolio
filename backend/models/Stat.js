const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  label: { 
    type: String, 
    required: true, 
    trim: true,
    maxLength: [100, 'Stat Label cannot exceed 100 characters']
  },
  value: { 
    type: Number, 
    required: true,
    min: [0, 'Value cannot be negative'],
    max: [999, 'Value cannot exceed 999']
  },
  suffix: { 
    type: String, 
    default: '',
    validate: {
      validator: function(v) {
        return !v || (v.length === 1 && /^[^\w\d\s]$/u.test(v) && !/\p{Extended_Pictographic}/u.test(v));
      },
      message: 'Suffix must be a single symbol character'
    }
  },
  icon: { 
    type: String, 
    default: '🚀',
    validate: {
      validator: function(v) {
        return !v || /^\p{Extended_Pictographic}\uFE0F?$/u.test(v);
      },
      message: 'Icon must be exactly one emoji'
    }
  },
  image: { type: String, default: '' },
  description: { 
    type: String, 
    required: true, 
    trim: true,
    maxLength: [200, 'Description cannot exceed 200 characters']
  },
  order: { 
    type: Number, 
    default: 0,
    min: [0, 'Display Order cannot be negative'],
    max: [999, 'Display Order cannot exceed 999']
  }
}, { timestamps: true });

module.exports = mongoose.model('Stat', statSchema);
