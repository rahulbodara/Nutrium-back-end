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
const { checkPermission } = require('../middleware/checkPermission');

//===================client CRUD===================//
router.post('/client', isAuthenticated, checkPermission("create", "Create client API"), registerClient);
router.delete('/client/:id', checkPermission("delete", "Delete client API"), isAuthenticated, deleteClient);
router.get('/client', isAuthenticated, checkPermission("read", "Get all clients of user API"), getAllClient);
router.get('/clients', isAuthenticated, checkPermission("read", "Get all clients API"), getAllClients)
router.get('/client/:id', isAuthenticated, checkPermission("read", "Get client data API"), getClientByID);
router.put(
  '/client/:id',
  upload.single('image'),
  isAuthenticated,
  updateClient
);

router.put("/client/set-client-password/:clientId", isAuthenticated, checkPermission("update", "Set client password API"), setClientPassword)

router.get('/client/search/list', isAuthenticated, searchClients);

//===================import History===================//


router.post('/client/import-history', isAuthenticated, addImportHistory);


//===================Appointment information===================//
router.put('/client/appointment/:id', isAuthenticated, checkPermission("update", "Update appointment info API"), updateAppointmentInfo);

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
  checkPermission("update", "Update personal history info API"),
  updatePersonalHistory
);

//===================Pregnancy history===================//

router.post(
  '/client/pregnancy-history',
  isAuthenticated,
  checkPermission("create", "Create pregnancy history API"),
  createPregnancyHistory);

router.get(
  '/client/get-pregnancy-history/:clientId',
  isAuthenticated,
  checkPermission("read", "Get pregnancy history API"),
  getPregnancyHistory);


router.put(
  '/client/update-pregnancy-history/:id',
  isAuthenticated,
  checkPermission("update", "Update pregnancy history API"),
  updatePregnancyHistory);

router.delete(
  '/client/delete-pregnancy-history/:pregnancyId',
  isAuthenticated,
  checkPermission("delete", "Delete pregnancy history API"),
  deletePregnancyHistory);


//===================Observations===================//
router.post('/client/observation', isAuthenticated, checkPermission("create", "Create observation info API"), addObservation);

router.put('/client/observation/:id', isAuthenticated, checkPermission("update", "Update observation info API"), updateObservation);

router.delete('/client/observation/:id', isAuthenticated, checkPermission("delete", "Delete observation info API"), deleteObservation);

router.get('/client/observation/:clientId', isAuthenticated, checkPermission("read", "Get observation info API"), getObservation);


//===================Medical history===================//
router.put(
  '/client/medical-history/:id',
  isAuthenticated,
  checkPermission("update", "Update medical history API"),
  updateMedicalHistory
);

//===================Dietary history===================//
router.put('/client/diet-history/:id', isAuthenticated, checkPermission("update", "Update diet history API"), updateDietHistory);

//===================Files===================//
router.post(
  '/client/file/:id',
  isAuthenticated,
  checkPermission("create", "Create file detail API"),
  pdfUpload.single('file'),
  createFileDetail
);

router.put(
  '/client/file/:fileId',
  isAuthenticated,
  checkPermission("update", "Update file detail API"),
  pdfUpload.single('file'),
  updateFileDetail
);

router.delete('/client/file/:fileId', isAuthenticated, checkPermission("delete", "Delete file detail API"), deleteFileDetail);

router.get('/client/file/:id', isAuthenticated, checkPermission("read", "Get file detail API"), getAllFileDetail);

//===================Eating behaviour===================//
router.post(
  '/client/eating-behaviour/:id',
  isAuthenticated,
  checkPermission("create", "Create eating behaviour API"),
  createEatingBehaviour
);

router.put(
  '/client/eating-behaviour/:clientId/:behaviourId',
  isAuthenticated,
  checkPermission("update", "Update eating behaviour API"),
  updateEatingBehaviour
);

router.delete(
  '/client/eating-behaviour/:clientId/:behaviourId',
  isAuthenticated,
  checkPermission("delete", "Delete eating behaviour API"),
  deleteEatingBehaviour
);

router.get('/client/eating-behaviour/:clientId', isAuthenticated, checkPermission("read", "Get eating behaviour API"), getAllEatingBehaviour);


//===================Food Diaries===================//
router.post('/client/food-diary/:id', isAuthenticated, checkPermission("create", "Create food diary API"), createFoodDiary);

router.delete('/client/food-diary/:foodId', isAuthenticated, checkPermission("delete", "Delete food diary API"), deleteFoodDiary);

router.put('/client/food-diary/:foodDiaryId', isAuthenticated, checkPermission("update", "Update food diary API"), updateFoodDiary);

router.get('/client/food-diary/:clientId', isAuthenticated, checkPermission("read", "Get food diary API"), getAllFoodDiary);

//===================Goals===================//
router.post('/client/goals/:id', isAuthenticated, checkPermission("create", "Create goal API"), createGoal);

router.delete('/client/goals/:clientId/:id', isAuthenticated, checkPermission("delete", "Delete goal API"), deleteGoal);

router.get('/client/goals/:clientId/:measurementType', isAuthenticated, checkPermission("read", "Get goal by measurement type API"), getGoalByMeasurementType);

router.get('/client/allGoals/:clientId', isAuthenticated, checkPermission("read", "Get all goal of client API"), getAllGoals);

router.put('/client-updateGoal/:clientId/entries/:entryId', isAuthenticated, checkPermission("update", "Update goal API"), updateGoal);

//===================Measurements===================//

router.post('/client/measurements/:id', isAuthenticated, checkPermission("create", "Register measurement API"), registerMeasurement);

router.post(
  '/client/new-measurements/:measurementId',
  isAuthenticated,
  checkPermission("create", "Add new measurement API"),
  addNewMeasurement
);

router.get(
  '/client/measurements/:clientId',
  isAuthenticated,
  checkPermission("read", "Get client measurement API"),
  getMeasurementById
);

router.delete(
  '/client/measurements/:clientId/entries/:entryId',
  isAuthenticated,
  checkPermission("delete", "Delete client measurement API"),
  deleteMeasurementObject
);

router.put(
  '/client/measurements/:clientId/entries/:entryId',
  isAuthenticated,
  checkPermission("update", "Update client measurement API"),
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
