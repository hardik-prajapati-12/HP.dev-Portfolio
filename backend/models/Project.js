const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxLength: [100, 'Project Title cannot exceed 100 characters']
  },
  description: { 
    type: String, 
    required: true,
    maxLength: [300, 'Short Description cannot exceed 300 characters']
  },
  longDescription: { type: String, default: '' },
  image: { type: String, default: '' },
  technologies: [{ type: String }],
  category: { type: String, required: true, trim: true },
  categoryColor: { type: String, default: '#6366F1' },
  features: [{ type: String }],
  status: { type: String, default: 'Completed' },
  date: { type: String, default: '' },
  caseStudy: {
    title: { 
      type: String, 
      default: '',
      maxLength: [200, 'Case Study Title cannot exceed 200 characters']
    },
    badge: { 
      type: String, 
      default: '',
      maxLength: [100, 'Case Study Badge cannot exceed 100 characters']
    },
    problem: { type: String, default: '' },
    insight: { 
      type: String, 
      default: '',
      maxLength: [300, 'Live Project Insight cannot exceed 300 characters']
    },
    architecture: [{
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    }],
    dataModel: [{
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    }],
    featureFocus: [{ type: String }],
    outcomes: [{ type: String }],
    caseStudyImage: { type: String, default: '' },
    architectureDiagrams: [{
      label: { type: String, required: true },
      imageUrl: { type: String, required: true }
    }],
  },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  showGithub: { type: Boolean, default: true },
  showLive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
