const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    default: 'Hardik Prajapati',
    maxLength: [50, 'Full Name cannot exceed 50 characters']
  },
  title: { 
    type: String, 
    default: 'Software Engineer',
    maxLength: [50, 'Job Title cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    default: '',
    maxLength: [100, 'Email cannot exceed 100 characters']
  },
  phone: { 
    type: String, 
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^\+\d+\s\d{10}$/.test(v);
      },
      message: 'Phone number must be formatted as +<country_code> <10_digits_number>'
    }
  },
  location: { 
    type: String, 
    default: '',
    maxLength: [50, 'Location cannot exceed 50 characters']
  },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  bio: { 
    type: String, 
    default: '',
    maxLength: [500, 'Bio cannot exceed 500 characters']
  },
  avatar: { type: String, default: '' },
  yearsExp: { 
    type: Number, 
    default: 0,
    min: [0, 'Years of experience cannot be negative'],
    max: [999, 'Years of experience cannot exceed 999']
  },
  resumeUrl: { type: String, default: '#' },
  roles: {
    type: [{ type: String }],
    validate: {
      validator: function(v) {
        return v.join(', ').length <= 200;
      },
      message: 'Roles cannot exceed 200 characters'
    }
  },
  heroTitle: {
    type: String,
    default: 'Full Stack Developer & Software Engineer',
    maxLength: [100, 'Sub Hero Title cannot exceed 100 characters']
  },
  heroDesc: {
    type: String,
    default: 'I build scalable, high-performance web applications with clean code and exceptional user experiences.',
    maxLength: [300, 'Hero Description cannot exceed 300 characters']
  },
  laptopName: {
    type: String,
    default: 'Hardik Prajapati',
    maxLength: [50, 'Laptop Screen Name cannot exceed 50 characters']
  },
  laptopTitle: {
    type: String,
    default: 'Full Stack Engineer',
    maxLength: [50, 'Laptop Screen Title cannot exceed 50 characters']
  },
  laptopSkills: {
    type: [{ type: String }],
    default: ["React", "Node.js", "Express", "MongoDB", "Java", "AI/ML", "DSA"],
    validate: {
      validator: function(v) {
        return v.join(', ').length <= 200;
      },
      message: 'Laptop skills cannot exceed 200 characters'
    }
  },
  laptopPassion: {
    type: String,
    default: 'Turning ideas into impact',
    maxLength: [100, 'Laptop Screen Passion cannot exceed 100 characters']
  },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
