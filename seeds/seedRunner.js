require("dotenv").config();
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const connectDB = require("../config/db");
const Vocabulary = require("../models/Vocabulary");
const UnitCurriculum = require("../models/UnitCurriculum");

function loadFrontendDataFile(relativePath, globalKey) {
  const filePath = path.join(__dirname, "../../", relativePath);
  const code = fs.readFileSync(filePath, "utf-8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.window[globalKey];
}

async function seedDatabase() {
  try {
    await connectDB();
    const unit1 = loadFrontendDataFile("src/data/unit1WorkingInIt.js", "Unit1Data");
    const unit2 = loadFrontendDataFile("src/data/unit2ItSystems.js", "Unit2Data");

    await Vocabulary.deleteMany({});
    await UnitCurriculum.deleteMany({});

    const allVocab = [
      ...unit1.vocabulary.map(v => ({ unit: "unit1", word: v.word, meaning: v.meaning, group: v.group })),
      ...unit2.vocabulary.map(v => ({ unit: "unit2", word: v.word, meaning: v.meaning, group: v.group }))
    ];
    await Vocabulary.insertMany(allVocab);

    await UnitCurriculum.insertMany([
      {
        unitId: "unit1",
        title: unit1.title,
        pages: unit1.pages,
        mcqs: unit1.mcqs,
        cloze: unit1.cloze,
        matching: unit1.matching,
        translations: unit1.translations
      },
      {
        unitId: "unit2",
        title: unit2.title,
        pages: unit2.pages,
        mcqs: unit2.mcqs,
        cloze: unit2.cloze,
        matching: unit2.matching,
        translations: unit2.translations
      }
    ]);

    console.log("✅ Đã nạp thành công 80 từ vựng và toàn bộ bài tập Unit 1 & Unit 2 vào MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi Seed Database:", error);
    process.exit(1);
  }
}

seedDatabase();