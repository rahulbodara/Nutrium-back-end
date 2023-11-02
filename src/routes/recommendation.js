const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

const {
  createRecommendation,
  deletePhysicalActivity,
  getRecommendations,
  createPhysicalActivity,
  getPhysicalActivity
} = require("../controller/recommendation");

router.put('/recommendations/:clientId',isAuthenticated,createRecommendation);

router.delete('/deleteActivity/:id/:subArrayIndex/:elementIndex',isAuthenticated,deletePhysicalActivity);

router.get('/recommendations/:clientId',isAuthenticated,getRecommendations);

router.post('/createActivity',createPhysicalActivity);

router.get('/activities',getPhysicalActivity);

module.exports = router;                                                             
