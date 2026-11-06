const express = require("express");
const router = express.Router();
const {
  getVocabularies,
  createVocabulary,
  updateSm2,
  deleteVocabulary
} = require("../controllers/vocabController");

router.get("/", getVocabularies);
router.post("/", createVocabulary);
router.put("/:id/sm2", updateSm2);
router.delete("/:id", deleteVocabulary);

module.exports = router;