const Vocabulary = require("../models/Vocabulary");

exports.getVocabularies = async (req, res, next) => {
  try {
    const filter = req.query.unit ? { unit: req.query.unit } : {};
    const items = await Vocabulary.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

exports.createVocabulary = async (req, res, next) => {
  try {
    const item = await Vocabulary.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.updateSm2 = async (req, res, next) => {
  try {
    const { efactor, interval, repetitions } = req.body;
    const item = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      { efactor, interval, repetitions },
      { new: true }
    );
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.deleteVocabulary = async (req, res, next) => {
  try {
    await Vocabulary.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted vocabulary card" });
  } catch (err) {
    next(err);
  }
};