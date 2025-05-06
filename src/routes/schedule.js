const express = require("express");
const router = express.Router();
const scheduleController = require("../controller/schedule");
const { isAuthenticated } = require("../middleware/auth");
const { checkPermission } = require("../middleware/checkPermission");

// router.get("/schedule", isAuthenticated, scheduleController.getAllSchedules);

router.post("/schedule", isAuthenticated, checkPermission("create", "Set schedule API"), scheduleController.setSchedule);

router.get("/schedule", isAuthenticated, checkPermission("read", "Get schedule API"), scheduleController.getScheduleById);

module.exports = router;
