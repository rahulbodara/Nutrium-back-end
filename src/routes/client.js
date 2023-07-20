const express = require('express');
const router = express.Router();
const multer = require('multer');

const { isAuthenticated } = require('../middleware/auth');
const {
  registerClient,
  deleteClient,
  getClientByID,
  getAllClient,
  updateClient,
  appointmentInfo,
  updateAppointmentInfo,
  updatePersonalHistory,
  updateObservation,
  deleteObservation,
  updateMedicalHistory,
  updateDietHistory,
  getAppointmentInfo,
} = require('../controller/client/client');

const upload = multer({ dest: 'src/uploads/' });

router.post('/client', isAuthenticated, registerClient);
router.delete('/client/:id', isAuthenticated, deleteClient);
router.get('/client', isAuthenticated, getAllClient);
router.get('/client/:id', isAuthenticated, getClientByID);
router.put(
  '/client/:id',
  upload.single('image'),
  isAuthenticated,
  updateClient
);

router.put('/client/appointment/:id', isAuthenticated, updateAppointmentInfo);

router.put(
  '/client/personal-history/:id',
  isAuthenticated,
  updatePersonalHistory
);
router.put('/client/observation/:id', isAuthenticated, updateObservation);
router.delete(
  '/client/observation/:clientId/:id',
  isAuthenticated,
  deleteObservation
);
router.put(
  '/client/medical-history/:id',
  isAuthenticated,
  updateMedicalHistory
);
router.put('/client/diet-history/:id', isAuthenticated, updateDietHistory);

module.exports = router;
