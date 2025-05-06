const express = require("express");
const router = express.Router();
const scheduleAppointmentController = require("../controller/scheduleappointment");
const { isAuthenticated } = require("../middleware/auth");
const { checkPermission } = require("../middleware/checkPermission");

router.put("/scheduleApointment/:id", isAuthenticated, checkPermission("update", "Update appointment API"), scheduleAppointmentController.updateAppointment);

router.post("/scheduleApointment", isAuthenticated, checkPermission("create", "Create appointment API"), scheduleAppointmentController.createAppointment);

router.get("/scheduleApointment", isAuthenticated, checkPermission("read", "Get all appointment API"), scheduleAppointmentController.getAllAppointments)

router.delete("/scheduleApointment/:id", isAuthenticated, checkPermission("delete", "Delete appointment API"), scheduleAppointmentController.deleteAppointment)

router.put("/updateAppointmentStatus/:id", isAuthenticated, checkPermission("update", "Update appointment status API"), scheduleAppointmentController.updateAppointementStatus)

router.get("/getAppointementDescription", isAuthenticated, scheduleAppointmentController.getAppointementDescription)

router.get("/updateEventStatus/:id", isAuthenticated, checkPermission("update", "Start appointment API"), scheduleAppointmentController.updateStartAppointment)

router.get("/getStartedAppointments", isAuthenticated, checkPermission("read", "Get started appointment API"), scheduleAppointmentController.getStartedAppointments)

router.get("/getAppointmentsByClientId/:clientId", checkPermission("read", "Get appointment by clientId API"), isAuthenticated, scheduleAppointmentController.getAppointmentByClientId)

module.exports = router;
