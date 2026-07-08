const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { type: String },
  userAgent: { type: String },
  page: { type: String, default: '/' },
  referrer: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
