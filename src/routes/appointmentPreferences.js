const express = require('express');
const router = express.Router();

const {
  createAppointmentPref,
  deleteAppointmentPref,
  getAppointmentPref,
  getAppointmentPrefByID,
  updateAppointmentPref,
} = require('../controller/appointmentPreferences');
const { isAuthenticated } = require('../middleware/auth');

router.post('/preferences', isAuthenticated, createAppointmentPref);
router.get('/preferences', isAuthenticated, getAppointmentPref);
router.delete('/preferences/:id', isAuthenticated, deleteAppointmentPref);
router.get('/preferences/:id', isAuthenticated, getAppointmentPrefByID);
router.put('/preferences/:id', isAuthenticated, updateAppointmentPref);

module.exports = router;
