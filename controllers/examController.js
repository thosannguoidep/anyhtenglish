const SubmissionLog = require("../models/SubmissionLog");

exports.submitToeicExam = async (req, res, next) => {
  try {
    const { answers = {}, score = 100 } = req.body;
    const log = await SubmissionLog.create({
      unitId: "toeic-part7",
      partType: "TOEIC",
      score,
      detailPayload: answers
    });
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};