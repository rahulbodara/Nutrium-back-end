const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

const {
  createRecommendation,
  deletePhysicalActivity,
  getRecommendations,
  createPhysicalActivity,
  getPhysicalActivity,
  addPhysicalActivityObject,
  setWaterIntakeLimit,
  waterIntakeLimit,
  setWaterIntake,
  getWaterIntake,
  updateWaterIntake,
  deleteWaterIntake,
  addPhysicalActivityByClient,
  getPhysicalActivityByClient
} = require("../controller/recommendation");

router.put('/recommendations/:clientId', isAuthenticated, createRecommendation);

router.delete('/deleteActivity/:clientId/:objectId', isAuthenticated, deletePhysicalActivity);

router.get('/recommendations/:clientId', isAuthenticated, getRecommendations);

router.post('/createActivity', createPhysicalActivity);

router.get('/activities', getPhysicalActivity);

router.put('/addActivity/:clientId', isAuthenticated, addPhysicalActivityObject);

router.post("/setwaterintakelimit/:clientId", isAuthenticated, setWaterIntakeLimit)

router.get("/getWaterIntakeLimit/:clientId", isAuthenticated, waterIntakeLimit)

router.post("/setwaterintake/:clientId", isAuthenticated, setWaterIntake)

router.get("/getWaterIntake/:clientId", isAuthenticated, getWaterIntake)

router.put("/updatewaterintake/:waterIntakeId/:waterRecordId/:waterIntakeAmountId", isAuthenticated, updateWaterIntake)

router.delete("/deletewaterintake/:waterIntakeId/:waterRecordId/:waterIntakeAmountId", isAuthenticated, deleteWaterIntake);

router.post("/clientSidePhysicalActivity/:clientId", isAuthenticated, addPhysicalActivityByClient)

router.get("/client-physical-activity/:clientId", isAuthenticated, getPhysicalActivityByClient)

module.exports = router;                                                             
