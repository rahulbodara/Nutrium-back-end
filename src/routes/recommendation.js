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
  getPhysicalActivityByClient,
  updatePhysicalActivityByClient,
  deletePhysicalActivityByClient,
  deleteAllPhysicalActivitiesByClient,
  getQuickAccessActivityByClient,
  getOtherRecommendation,
  getFoodAvoid
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

router.put("/update-physical-activity/:clientId/:activityId", isAuthenticated, updatePhysicalActivityByClient)

router.delete("/delete-physical-activity/:clientId/:activityId", isAuthenticated, deletePhysicalActivityByClient)

router.delete("/delete-physical-activity/:clientId", isAuthenticated, deleteAllPhysicalActivitiesByClient)

router.get("/get-quick-access-activity/:clientId", isAuthenticated, getQuickAccessActivityByClient)

router.get("/get-other-recommendation/:clientId", isAuthenticated, getOtherRecommendation)

router.get("/get-food-avoid/:clientId", isAuthenticated, getFoodAvoid)

module.exports = router;                                                             
