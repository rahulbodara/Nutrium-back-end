const express = require("express");
const router = express.Router();
const scheduleController = require("../controller/schedule");
const { isAuthenticated } = require("../middleware/auth");

router.get("/schedule", isAuthenticated, scheduleController.getAllSchedules);

router.post("/schedule/:userId", isAuthenticated, scheduleController.setSchedule);

router.get("/schedule/:userId", isAuthenticated, scheduleController.getScheduleById);

module.exports = router;
