const express = require("express");
const router = express.Router();
const scheduleAppointmentController = require("../controller/scheduleappointment");
const { isAuthenticated } = require("../middleware/auth");

// router.get("/scheduleApointment", isAuthenticated, scheduleAppointmentController);
router.post("/scheduleApointment/:id", isAuthenticated, scheduleAppointmentController.createAppointment);

module.exports = router;
