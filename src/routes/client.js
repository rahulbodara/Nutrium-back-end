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
  addObservation,
  updatePregnancyHistory,
  updateObservation,
  deleteObservation,
  getObservation,
  updateMedicalHistory,
  updateDietHistory,
  deleteFileDetail,
  updateFileDetail,
  createFileDetail,
  getAllFileDetail,
  createEatingBehaviour,
  deleteEatingBehaviour,
  updateEatingBehaviour,
  getAllEatingBehaviour,
  createFoodDiary,
  deleteFoodDiary,
  updateFoodDiary,
  getAllFoodDiary,
  createGoal,
  deleteGoal,
  getGoalByMeasurementType,
  getAllGoals,
  registerMeasurement,
  addNewMeasurement,
  getMeasurementById,
  deleteMeasurementObject,
  updateMeasurementObject,
  getBodyFatPercentage,
  getWeight,
  updateBmi,
  updateGoal
} = require('../controller/client/client');
const upload = require('../middleware/imageHandler');

//===================client CRUD===================//
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

//===================Appointment information===================//
router.put('/client/appointment/:id', isAuthenticated, updateAppointmentInfo);

//===================Personal and social history===================//
router.put(
  '/client/personal-history/:id',
  isAuthenticated,
  updatePersonalHistory
);

//===================Pregnancy history===================//


router.post(
  '/client/pregnancy-history',
  isAuthenticated,
  updatePregnancyHistory);


//===================Observations===================//
router.post('/client/observation', isAuthenticated, addObservation);

router.put('/client/observation/:id', isAuthenticated, updateObservation);

router.delete('/client/observation/:id', isAuthenticated, deleteObservation);

router.get('/client/observation/:clientId', isAuthenticated, getObservation);


//===================Medical history===================//
router.put(
  '/client/medical-history/:id',
  isAuthenticated,
  updateMedicalHistory
);

//===================Dietary history===================//
router.put('/client/diet-history/:id', isAuthenticated, updateDietHistory);

//===================Files===================//
router.post(
  '/client/file/:id',
  isAuthenticated,
  upload.single('file'),
  createFileDetail
);

router.put(
  '/client/file/:fileId',
  isAuthenticated,
  upload.single('file'),
  updateFileDetail
);

router.delete('/client/file/:fileId', isAuthenticated, deleteFileDetail);

router.get('/client/file/:id', isAuthenticated, getAllFileDetail);

//===================Eating behaviour===================//
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

router.get('/client/eating-behaviour/:clientId', isAuthenticated, getAllEatingBehaviour);


//===================Food Diaries===================//
router.post('/client/food-diary/:id', isAuthenticated, createFoodDiary);

router.delete('/client/food-diary/:foodId', isAuthenticated, deleteFoodDiary);

router.put('/client/food-diary/:foodDiaryId', isAuthenticated, updateFoodDiary);

router.get('/client/food-diary/:clientId', isAuthenticated, getAllFoodDiary);

//===================Goals===================//
router.post('/client/goals/:id', isAuthenticated, createGoal);

router.delete('/client/goals/:goalId', isAuthenticated, deleteGoal);

router.get('/client/goals/:clientId/:measurementType',isAuthenticated, getGoalByMeasurementType);

router.get('/client/allGoals/:clientId', isAuthenticated, getAllGoals);

//===================Measurements===================//
router.post('/client/measurements/:id', isAuthenticated, registerMeasurement);

router.post(
  '/client/new-measurements/:measurementId',
  isAuthenticated,
  addNewMeasurement
);

router.get(
  '/client/measurements/:measurementId',
  isAuthenticated,
  getMeasurementById
);

router.delete(
  '/client/measurements/:measurementId',
  isAuthenticated,
  deleteMeasurementObject
);

router.put(
  '/client/measurements/:measurementId',
  isAuthenticated,
  updateMeasurementObject
);

//===================planning===================//
router.get('/client-getWeight', isAuthenticated, getWeight);

router.get('/client-getBodyFat', isAuthenticated, getBodyFatPercentage);

router.put('/client-updateBmi', isAuthenticated, updateBmi);

router.put('/client-updateGoal/:goalId', isAuthenticated, updateGoal);

module.exports = router;
