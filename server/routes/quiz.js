const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { generateQuiz, submitQuiz, getQuizzes } = require('../controllers/quizController');
router.post('/generate', auth, generateQuiz);
router.post('/submit/:id', auth, submitQuiz);
router.get('/', auth, getQuizzes);
module.exports = router;