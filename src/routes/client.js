const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middleware/auth');
const {
  registerClient,
  addImportHistory,
  deleteClient,
  getClientByID,
  getAllClient,
  updateClient,
  updateAppointmentInfo,
  updatePersonalHistory,
  addObservation,
  createPregnancyHistory,
  updatePregnancyHistory,
  deletePregnancyHistory,
  getPregnancyHistory,
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
  getClientInfo,
  updateBmi,
  updateGoal,
  updateClientPassword,
  sendClientEmail,
  clientLogin,
  clientGoogleLogin,
  addOrUpdateClientMeasurement,
  setClientPassword,
  clientFormEmailSend,
  searchClients,
  getAllClients,
  getFormConfiguration
} = require('../controller/client/client');
const upload = require('../middleware/imageHandler');
const { getPdfData } = require('../controller/user');
const pdfUpload = require('../middleware/pdfHandler');

//===================client CRUD===================//
router.post('/client', isAuthenticated, registerClient);
router.delete('/client/:id', isAuthenticated, deleteClient);
router.get('/client', isAuthenticated, getAllClient);
router.get('/clients', isAuthenticated, getAllClients)
router.get('/client/:id', isAuthenticated, getClientByID);
router.put(
  '/client/:id',
  upload.single('image'),
  isAuthenticated,
  updateClient
);

router.put("/client/set-client-password/:clientId", isAuthenticated, setClientPassword)

router.get('/client/search/list', isAuthenticated, searchClients);

//===================import History===================//


router.post('/client/import-history', isAuthenticated, addImportHistory);


//===================Appointment information===================//
router.put('/client/appointment/:id', isAuthenticated, updateAppointmentInfo);

//===================Personal and social history===================//
router.put(
  '/client/personal-history/:id',
  upload.fields([
    { name: 'beforePicture1', maxCount: 1 },
    { name: 'beforePicture2', maxCount: 1 },
    { name: 'beforePicture3', maxCount: 1 },
    { name: 'beforePicture4', maxCount: 1 },
    { name: 'beforePicture5', maxCount: 1 },
    { name: 'afterPicture1', maxCount: 1 },
    { name: 'afterPicture2', maxCount: 1 },
    { name: 'afterPicture3', maxCount: 1 },
    { name: 'afterPicture4', maxCount: 1 },
    { name: 'afterPicture5', maxCount: 1 },]),
  isAuthenticated,
  updatePersonalHistory
);

//===================Pregnancy history===================//

router.post(
  '/client/pregnancy-history',
  isAuthenticated,
  createPregnancyHistory);

router.get(
  '/client/get-pregnancy-history/:clientId',
  isAuthenticated,
  getPregnancyHistory);


router.put(
  '/client/update-pregnancy-history/:id',
  isAuthenticated,
  updatePregnancyHistory);

router.delete(
  '/client/delete-pregnancy-history/:pregnancyId',
  isAuthenticated,
  deletePregnancyHistory);


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
  pdfUpload.single('file'),
  createFileDetail
);

router.put(
  '/client/file/:fileId',
  isAuthenticated,
  pdfUpload.single('file'),
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

router.delete('/client/goals/:clientId/:id', isAuthenticated, deleteGoal);

router.get('/client/goals/:clientId/:measurementType', isAuthenticated, getGoalByMeasurementType);

router.get('/client/allGoals/:clientId', isAuthenticated, getAllGoals);

router.put('/client-updateGoal/:clientId/entries/:entryId', isAuthenticated, updateGoal);

//===================Measurements===================//

router.post('/client/measurements/:id', isAuthenticated, registerMeasurement);

router.post(
  '/client/new-measurements/:measurementId',
  isAuthenticated,
  addNewMeasurement
);

router.get(
  '/client/measurements/:clientId',
  isAuthenticated,
  getMeasurementById
);

router.delete(
  '/client/measurements/:clientId/entries/:entryId',
  isAuthenticated,
  deleteMeasurementObject
);

router.put(
  '/client/measurements/:clientId/entries/:entryId',
  isAuthenticated,
  updateMeasurementObject);

router.post("/client/update-measurements/:clientId", isAuthenticated, addOrUpdateClientMeasurement)


//===================planning===================//
router.get('/client-getWeight/:clientId', isAuthenticated, getClientInfo);

router.put('/client-updateBmi/:clientId', isAuthenticated, updateBmi);

router.put('/setPassword/:email', updateClientPassword)

router.get('/sendEmail/:clientId', isAuthenticated, sendClientEmail);

//===================getpdfData===================//
router.post('/client-getpdfData/:clientId', isAuthenticated, getPdfData)

//===================mobile Api's===================//
router.post('/client/login', clientLogin)
router.post('/client/goolelogin', clientGoogleLogin)

router.get("/client/sendClientform/:id", isAuthenticated, clientFormEmailSend)

router.get('/client/form-configuration/:id', getFormConfiguration)

module.exports = router;
