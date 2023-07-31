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
  createEatingBehaviour,
  deleteEatingBehaviour,
  updateEatingBehaviour,
  createFoodDiary,
  deleteFoodDiary,
  updateFoodDiary,
  createGoalType,
  deleteGoalType,
} = require('../controller/client/client');
const upload = require('../middleware/imageHandler');

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

router.post(
  '/client/file/:id',
  isAuthenticated,
  upload.single('file'),
  createFileDetail
);

router.put(
  '/client/file/:clientId/:fileId',
  isAuthenticated,
  upload.single('file'),
  updateFileDetail
);

router.delete(
  '/client/file/:clientId/:fileId',
  isAuthenticated,
  deleteFileDetail
);

router.get('/client/file/:id', isAuthenticated, getAllFileDetail);

router.post(
  '/client/eating-behaviour/:id',
  isAuthenticated,
  createEatingBehaviour
);

router.put(
  '/client/eating-behaviour/:clientId/:behaviourId',
  isAuthenticated,
  updateEatingBehaviour
);

router.delete(
  '/client/eating-behaviour/:clientId/:behaviourId',
  isAuthenticated,
  deleteEatingBehaviour
);

router.post('/client/food-diary/:id', isAuthenticated, createFoodDiary);

router.delete(
  '/client/food-diary/:clientId/:foodId',
  isAuthenticated,
  deleteFoodDiary
);

router.put(
  '/client/food-diary/:clientId/:foodDiaryId',
  isAuthenticated,
  updateFoodDiary
);

router.post('/client/goals/:id', isAuthenticated, createGoalType);

router.delete(
  '/client/goals/:clientId/:goalId',
  isAuthenticated,
  deleteGoalType
);

module.exports = router;
