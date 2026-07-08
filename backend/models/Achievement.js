const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxLength: [100, 'Achievement Title cannot exceed 100 characters']
  },
  desc: { type: String, required: true },
  icon: { 
    type: String, 
    default: '🏆',
    validate: {
      validator: function(v) {
        return !v || /^\p{Extended_Pictographic}\uFE0F?$/u.test(v);
      },
      message: 'Icon must be exactly one emoji'
    }
  },
  image: { type: String, default: '' },
  certificateImage: { type: String, default: '' },
  value: { 
    type: String, 
    required: true,
    maxLength: [50, 'Value/Metric cannot exceed 50 characters']
  },
  order: { type: Number, default: 0 },
  details: { type: String, default: '' },
  skills: { 
    type: String, 
    default: '',
    maxLength: [300, 'Skills Demonstrated cannot exceed 300 characters']
  },
  color: { type: String, default: '#8B5CF6' },
  issuer: { type: String, default: 'Portfolio Milestone' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
