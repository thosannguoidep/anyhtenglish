const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema(
  {
    unit: { type: String, required: true, index: true },
    word: { type: String, required: true, trim: true },
    meaning: { type: String, required: true },
    group: { type: String, default: "General IT" },
    efactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 1 },
    repetitions: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vocabulary", vocabularySchema);