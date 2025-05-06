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
  getFoodAvoid,
  getActivitiesByClientId
} = require("../controller/recommendation");
const { checkPermission } = require("../middleware/checkPermission");

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

router.post("/clientSidePhysicalActivity/:clientId", isAuthenticated, checkPermission("create", "Add client physical activity API"), addPhysicalActivityByClient)

router.get("/activity/:clientId", isAuthenticated, getActivitiesByClientId)

router.get("/client-physical-activity/:clientId", isAuthenticated, checkPermission("read", "Get client physical activity API"), getPhysicalActivityByClient)

router.put("/update-physical-activity/:clientId/:activityId", isAuthenticated, checkPermission("update", "Update client physical activity API"), updatePhysicalActivityByClient)

router.delete("/delete-physical-activity/:clientId/:activityId", isAuthenticated, deletePhysicalActivityByClient)

router.delete("/delete-physical-activity/:clientId", isAuthenticated, deleteAllPhysicalActivitiesByClient)

router.get("/get-quick-access-activity/:clientId", isAuthenticated, checkPermission("read", "Get client quick access activity API"), getQuickAccessActivityByClient)

router.get("/get-other-recommendation/:clientId", isAuthenticated, getOtherRecommendation)

router.get("/get-food-avoid/:clientId", isAuthenticated, getFoodAvoid)

module.exports = router;                                                             
