const mongoose = require('mongoose');
const subjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  examDate: { type: Date, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  hoursPerDay: { type: Number, default: 2 },
  topics: [{ name: String, done: { type: Boolean, default: false } }],
  color: { type: String, default: '#FFD600' }
}, { timestamps: true });
module.exports = mongoose.model('Subject', subjectSchema);
