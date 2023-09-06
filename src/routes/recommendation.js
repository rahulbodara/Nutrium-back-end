const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

const {
  createRecommendation,
  deletePhysicalActivity
} = require("../controller/recommendation");

router.post('/recommendations/:clientId',isAuthenticated,createRecommendation);

router.delete('/deleteActivity/:id/:subArrayIndex/:elementIndex',isAuthenticated,deletePhysicalActivity);

module.exports = router;
