const express = require("express");
const router = express.Router();
const scheduleAppointmentController = require("../controller/scheduleappointment");
const { isAuthenticated } = require("../middleware/auth");

router.put("/scheduleApointment/:id", isAuthenticated, scheduleAppointmentController.updateAppointment);

module.exports = router;
