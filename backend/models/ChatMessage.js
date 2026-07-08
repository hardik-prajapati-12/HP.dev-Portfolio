const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  from: { type: String, required: true, enum: ['user', 'bot'] },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  kind: { type: String, default: 'text' },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
