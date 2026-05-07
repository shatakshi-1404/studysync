const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getAll, add, update, remove, toggleTopic } = require('../controllers/subjectController');
router.get('/', auth, getAll);
router.post('/', auth, add);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);
router.patch('/:id/topic/:topicId', auth, toggleTopic);
module.exports = router;