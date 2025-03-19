const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { addRecommendationTemplate, fetchRecommendationTemplate, getAllRecommendationTemplate } = require('../controller/RecommedationTemplate');
const router = express.Router();

router.post("/addRecommendationTemplate", isAuthenticated, addRecommendationTemplate)
router.get("/recommendation-template", isAuthenticated, fetchRecommendationTemplate)
router.get("/get-recommendation-template", isAuthenticated, getAllRecommendationTemplate)



module.exports = router;