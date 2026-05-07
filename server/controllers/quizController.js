const Quiz = require('../models/Quiz');

exports.generateQuiz = async (req, res) => {
  try {
    const { subjectName, notes, numQuestions = 5 } = req.body;

    const prompt = `
      Generate ${numQuestions} multiple choice quiz questions for the subject "${subjectName}".
      ${notes ? `Based on these notes: ${notes}` : ''}
      
      Return ONLY a JSON array, no extra text:
      [
        {
          "question": "What is...?",
          "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
          "correct": "A) option1",
          "explanation": "Because..."
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
    if (!data.choices?.[0]) return res.status(500).json({ message: 'AI failed' });

    const raw = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(raw);

    const quiz = await Quiz.create({
      userId: req.user.id,
      subjectName,
      questions,
      total: questions.length
    });

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user.id });
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
    quiz.score = score;
    quiz.completed = true;
    await quiz.save();
    res.json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) { res.status(500).json({ message: err.message }); }
};