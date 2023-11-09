const express = require("express");
const router = express.Router();
const scheduleAppointmentController = require("../controller/scheduleappointment");
const { isAuthenticated } = require("../middleware/auth");

router.put("/scheduleApointment/:id", isAuthenticated, scheduleAppointmentController.updateAppointment);

router.post("/scheduleApointment",isAuthenticated,scheduleAppointmentController.createAppointment);

router.get("/scheduleApointment",isAuthenticated,scheduleAppointmentController.getAllAppointments)

router.delete("/scheduleApointment/:id",isAuthenticated,scheduleAppointmentController.deleteAppointment)

router.put("/updateAppointmentStatus/:id",isAuthenticated,scheduleAppointmentController.updateAppointementStatus)

router.get("/getAppointementDescription",isAuthenticated,scheduleAppointmentController.getAppointementDescription)

router.get("/updateEventStatus/:id", isAuthenticated, scheduleAppointmentController.updateStartAppointment)

router.get("/getStartedAppointments", isAuthenticated, scheduleAppointmentController.getStartedAppointments)

module.exports = router;
