const UnitCurriculum = require("../models/UnitCurriculum");
const SubmissionLog = require("../models/SubmissionLog");

exports.getUnitById = async (req, res, next) => {
  try {
    const unit = await UnitCurriculum.findOne({ unitId: req.params.unitId });
    if (!unit) return res.status(404).json({ success: false, message: "Không tìm thấy Unit" });
    res.json({ success: true, data: unit });
  } catch (err) {
    next(err);
  }
};

exports.gradeTranslation = async (req, res, next) => {
  try {
    const { unitId, userText, keywords = [] } = req.body;
    const lower = String(userText || "").toLowerCase();
    const matched = keywords.filter(k => lower.includes(k.toLowerCase()));
    const score = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 100;

    const log = await SubmissionLog.create({
      unitId: unitId || "unit1",
      partType: "TRANSLATION",
      score,
      detailPayload: { userText, matched }
    });
    res.json({ success: true, score, matched, logId: log._id });
  } catch (err) {
    next(err);
  }
};