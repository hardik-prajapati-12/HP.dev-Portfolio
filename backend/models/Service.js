const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxLength: [100, 'Service Title cannot exceed 100 characters']
  },
  desc: { 
    type: String, 
    required: true,
    maxLength: [500, 'Description cannot exceed 500 characters']
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
  color: { type: String, default: '#10B981' },
  order: { type: Number, default: 0 },
  subtitle: { 
    type: String, 
    default: '',
    maxLength: [100, 'Subtitle / Tagline cannot exceed 100 characters']
  },
  description: { type: String, default: '' },
  pillars: { type: [String], default: [] },
  techStack: { type: [String], default: [] },
  workflow: { type: [String], default: [] },
  impact: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
