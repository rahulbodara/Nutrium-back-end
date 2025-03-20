const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { addRecommendationTemplate, fetchRecommendationTemplate, getAllRecommendationTemplate, editRecommendationTemplate, deleteRecommendationTemplate } = require('../controller/RecommedationTemplate');
const router = express.Router();

router.post("/addRecommendationTemplate", isAuthenticated, addRecommendationTemplate)
router.get("/recommendation-template", isAuthenticated, fetchRecommendationTemplate)
router.get("/get-recommendation-template", isAuthenticated, getAllRecommendationTemplate)
router.put("/edit-recommendation-template/:id", isAuthenticated, editRecommendationTemplate)
router.delete("/delete-recommendation-template/:id", isAuthenticated, deleteRecommendationTemplate)



module.exports = router;    