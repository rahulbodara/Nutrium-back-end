const express = require("express");
const router = express.Router();
const {
  getAllMeasures,
  createMeasure,
  updateMeasure,
  deleteMeasure,
} = require("../controller/recipemeasure");
const { isAuthenticated } = require("../middleware/auth");

router.get("/measure", isAuthenticated, getAllMeasures);
router.post("/measure", isAuthenticated, createMeasure);
router.put("/measure/:id", isAuthenticated, updateMeasure);
router.delete("/measure/:id", isAuthenticated, deleteMeasure);

module.exports = router;
