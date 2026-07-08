const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxLength: [100, 'Certification Title cannot exceed 100 characters']
  },
  issuer: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: [100, 'Issuer cannot exceed 100 characters']
  },
  date: { type: Date, required: true },
  credentialId: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  logo: { type: String, default: '' },
  image: { type: String, default: '' },
  category: { type: String, default: 'General' },
  color: { type: String, default: '#10B981' },
  badge: { 
    type: String, 
    default: '🏆',
    validate: {
      validator: function(v) {
        return !v || /^\p{Extended_Pictographic}\uFE0F?$/u.test(v);
      },
      message: 'Badge Icon must be exactly one emoji'
    }
  },
  description: { type: String, default: '' },
  skills: { 
    type: String, 
    default: '',
    maxLength: [200, 'Skills Learned cannot exceed 200 characters']
  },
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
