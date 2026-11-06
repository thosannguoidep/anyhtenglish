const express = require("express");
const router = express.Router();
const { getUnitById, gradeTranslation } = require("../controllers/unitController");

router.get("/:unitId", getUnitById);
router.post("/grade-translation", gradeTranslation);

module.exports = router;