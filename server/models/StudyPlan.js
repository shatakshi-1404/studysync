const mongoose = require('mongoose');
const studyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  subjectName: { type: String },
  plan: [{
    day: Number,
    date: String,
    topics: [String],
    hours: Number,
    completed: { type: Boolean, default: false }
  }],
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model('StudyPlan', studyPlanSchema);