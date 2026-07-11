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
  enableChatbot: { type: Boolean, default: true },
  chatbotName: { type: String, default: "Hardik's AI Assistant" },
  chatbotSubtitle: { type: String, default: "Portfolio guide and inquiry assistant" },
  chatbotWelcomeMessage: { type: String, default: "Hi, I am Hardik's portfolio assistant. Ask me about my skills, projects, services, experience, or use Message to send a direct inquiry." },
  chatbotThemeColor: { type: String, default: "#6366F1" },
  fallbackSkills: { type: String, default: "Hardik works across the full MERN stack with strong frontend, backend, database, and tooling coverage." },
  fallbackProjects: { type: String, default: "Here are a few featured projects from the portfolio:" },
  fallbackServices: { type: String, default: "Hardik can help with full stack web apps, API development, frontend implementation, database design, performance work, and technical consulting." },

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
