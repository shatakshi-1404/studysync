const Subject = require('../models/Subject');

exports.getAll = async (req, res) => {
  const subjects = await Subject.find({ userId: req.user.id });
  res.json(subjects);
};

exports.add = async (req, res) => {
  try {
    const subject = await Subject.create({ ...req.body, userId: req.user.id });
    res.status(201).json(subject);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body, { new: true }
    );
    res.json(subject);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Subject deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.toggleTopic = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user.id });
    const topic = subject.topics.id(req.params.topicId);
    topic.done = !topic.done;
    await subject.save();
    res.json(subject);
  } catch (err) { res.status(500).json({ message: err.message }); }
};