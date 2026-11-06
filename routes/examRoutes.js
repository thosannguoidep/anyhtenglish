const express = require("express");
const router = express.Router();
const { submitToeicExam } = require("../controllers/examController");

router.post("/submit", submitToeicExam);

module.exports = router;