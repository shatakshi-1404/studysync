const Subject = require('../models/Subject');
const StudyPlan = require('../models/StudyPlan');

exports.generatePlan = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.subjectId, userId: req.user.id });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const today = new Date();
    const examDate = new Date(subject.examDate);
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) return res.status(400).json({ message: 'Exam date has passed!' });

    const topicList = subject.topics.map(t => t.name).join(', ') || 'General topics';

    const prompt = `
      Create a day-by-day study plan for the subject "${subject.name}".
      Topics to cover: ${topicList}
      Days available: ${daysLeft}
      Hours per day: ${subject.hoursPerDay}
      Difficulty: ${subject.difficulty}
      
      Return ONLY a JSON array like this, no extra text:
      [
        {
          "day": 1,
          "date": "2024-01-15",
          "topics": ["Topic 1", "Topic 2"],
          "hours": 2,
          "completed": false
        }
      ]
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'StudySync'
      },
      body: JSON.stringify({
        model: 'tencent/hy3-preview:free',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (!data.choices?.[0]) return res.status(500).json({ message: 'AI failed to respond' });

    const raw = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    const plan = JSON.parse(raw);

    await StudyPlan.findOneAndDelete({ userId: req.user.id, subjectId: subject._id });
    const savedPlan = await StudyPlan.create({
      userId: req.user.id,
      subjectId: subject._id,
      subjectName: subject.name,
      plan
    });

    res.json(savedPlan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getPlan = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ userId: req.user.id, subjectId: req.params.subjectId });
    res.json(plan);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.toggleDay = async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({ userId: req.user.id, subjectId: req.params.subjectId });
    const day = studyPlan.plan[req.params.dayIndex];
    day.completed = !day.completed;
    await studyPlan.save();
    res.json(studyPlan);
  } catch (err) { res.status(500).json({ message: err.message }); }
};