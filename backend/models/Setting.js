const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // SMTP Configuration
  smtpHost: { type: String, default: '' },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: '' },
  smtpPass: { type: String, default: '' },
  smtpFrom: { type: String, default: '' },
  smtpFromName: { type: String, default: 'HP.dev' },
  smtpEncryption: { type: String, default: 'tls' }, // 'tls', 'ssl', 'none'

  // General Configurations
  siteTitle: { type: String, default: 'HP.dev' },
  siteLogoText: { type: String, default: 'HP.dev' },
  maintenanceMode: { type: Boolean, default: false },
  googleAnalyticsId: { type: String, default: '' },
  enableVisitorLogging: { type: Boolean, default: true },

  // Section Visibility Settings
  visibleSections: {
    about: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    services: { type: Boolean, default: true },
    certifications: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
    testimonials: { type: Boolean, default: true },
    contact: { type: Boolean, default: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
