const mongoose = require("mongoose");

const unitCurriculumSchema = new mongoose.Schema(
  {
    unitId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    pages: { type: String },
    mcqs: { type: Array, default: [] },
    cloze: { type: Object, default: {} },
    matching: { type: Array, default: [] },
    translations: { type: Array, default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UnitCurriculum", unitCurriculumSchema);