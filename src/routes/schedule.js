// routes/scheduleRoutes.js
const express = require("express");
const router = express.Router();
const scheduleController = require("../controller/schedule");
const { isAuthenticated } = require("../middleware/auth");

router.get("/schedule", isAuthenticated, scheduleController.getAllSchedules);
router.post("/schedule", isAuthenticated, scheduleController.setSchedule);

module.exports = router;
