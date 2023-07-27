const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middleware/auth');
const {
  registerClient,
  deleteClient,
  getClientByID,
  getAllClient,
  updateClient,
  updateAppointmentInfo,
  updatePersonalHistory,
  updateObservation,
  deleteObservation,
  updateMedicalHistory,
  updateDietHistory,
  deleteFileDetail,
  updateFileDetail,
  createFileDetail,
  getAllFileDetail,
  // createEatingBehaviour,
  // deleteEatingBehaviour,
} = require('../controller/client/client');
const upload = require('../middleware/imageHandler');

// const upload = multer({ dest: 'src/uploads/' });

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
// router.get('/client/appointment/:id', isAuthenticated, );

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

router.post(
  '/client/file/:id',
  isAuthenticated,
  upload.single('file'),
  createFileDetail
);

router.put(
  '/client/file/:id',
  isAuthenticated,
  upload.single('file'),
  updateFileDetail
);

router.delete('/client/file/:id', isAuthenticated, deleteFileDetail);

router.get('/client/file/:id', isAuthenticated, getAllFileDetail);

// router.post('/client/behaviour/:id', isAuthenticated, createEatingBehaviour);

// router.delete('/client/behaviour/:id', isAuthenticated, deleteEatingBehaviour);

module.exports = router;
