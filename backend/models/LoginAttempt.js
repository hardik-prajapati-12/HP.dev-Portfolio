const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema({
  ip: { type: String, required: true, index: true },
  email: { type: String, required: true, lowercase: true, index: true },
  attempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  lastAttempt: { type: Date, default: Date.now },
}, { timestamps: true });

loginAttemptSchema.index({ ip: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('LoginAttempt', loginAttemptSchema);
