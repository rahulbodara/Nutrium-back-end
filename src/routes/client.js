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

router.put('/client/information/:id', isAuthenticated, updateAppointmentInfo);

router.put(
  '/client/information/personal-history/:id',
  isAuthenticated,
  updatePersonalHistory
);

router.put(
  '/client/information/observation/:id',
  isAuthenticated,
  updateObservation
);

router.put(
  '/client/information/observation/:id/:observationId',
  isAuthenticated,
  deleteObservation
);

module.exports = router;
