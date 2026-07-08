const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
  replySubject: { type: String },
  replyMessage: { type: String },
  repliedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
