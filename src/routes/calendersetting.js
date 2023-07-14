const express = require("express");
const router = express.Router();
const {
  createCalenderSetting,
  updateCalenderSetting,
  getCalenderSetting,
} = require("../controller/calendersetting");
const { isAuthenticated } = require("../middleware/auth");

router.post("/calendersettings", isAuthenticated, createCalenderSetting);

router.get("/calendersettings", isAuthenticated, getCalenderSetting);

router.put("/calendersettings/:id", isAuthenticated, updateCalenderSetting);

module.exports = router;
