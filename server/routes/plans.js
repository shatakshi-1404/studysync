const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { generatePlan, getPlan, toggleDay } = require('../controllers/planController');
router.post('/generate/:subjectId', auth, generatePlan);
router.get('/:subjectId', auth, getPlan);
router.patch('/:subjectId/day/:dayIndex', auth, toggleDay);
module.exports = router;