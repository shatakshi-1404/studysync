const mongoose = require('mongoose');
const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectName: { type: String },
  questions: [{
    question: String,
    options: [String],
    correct: String,
    explanation: String
  }],
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Quiz', quizSchema);