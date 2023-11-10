const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

const {
  createRecommendation,
  deletePhysicalActivity,
  getRecommendations,
  createPhysicalActivity,
  getPhysicalActivity,
  addPhysicalActivityObject
} = require("../controller/recommendation");

router.put('/recommendations/:clientId',isAuthenticated,createRecommendation);

router.delete('/deleteActivity/:clientId/:objectId',isAuthenticated,deletePhysicalActivity);

router.get('/recommendations/:clientId',isAuthenticated,getRecommendations);

router.post('/createActivity',createPhysicalActivity);

router.get('/activities',getPhysicalActivity);

router.put('/addActivity/:clientId',isAuthenticated,addPhysicalActivityObject);

module.exports = router;                                                             
