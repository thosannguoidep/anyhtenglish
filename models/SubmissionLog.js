const mongoose = require("mongoose");

const submissionLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    unitId: { type: String, required: true },
    partType: { type: String, enum: ["MCQ", "CLOZE", "MATCHING", "TRANSLATION", "TOEIC"], required: true },
    score: { type: Number, required: true },
    detailPayload: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubmissionLog", submissionLogSchema);