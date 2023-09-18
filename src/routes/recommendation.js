const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

const {
  createRecommendation,
  deletePhysicalActivity,
  getRecommendations
} = require("../controller/recommendation");

router.put('/recommendations/:clientId',isAuthenticated,createRecommendation);

router.delete('/deleteActivity/:id/:subArrayIndex/:elementIndex',isAuthenticated,deletePhysicalActivity);

router.get('/recommendations/:clientId',isAuthenticated,getRecommendations);

module.exports = router;
