const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { addRecommendationTemplate, fetchRecommendationTemplate, getAllRecommendationTemplate, editRecommendationTemplate, deleteRecommendationTemplate, getRecommendationtempletId } = require('../controller/RecommedationTemplate');
const { checkPermission } = require('../middleware/checkPermission');
const router = express.Router();

router.post("/addRecommendationTemplate", isAuthenticated, checkPermission('create', "Create recommendation template API"), addRecommendationTemplate)
router.get("/recommendation-template", isAuthenticated, checkPermission('read', "Get all recommendation template API"), fetchRecommendationTemplate)
router.get("/get-recommendation-template", isAuthenticated, checkPermission('read', "Get all recommendation template API"), getAllRecommendationTemplate)
router.get("/get-recommendation-template/:id", isAuthenticated, checkPermission("read", "Get recommendation template API"), getRecommendationtempletId)
router.put("/edit-recommendation-template/:id", isAuthenticated, checkPermission("update", "Update recommendation template API"), editRecommendationTemplate)
router.delete("/delete-recommendation-template/:id", isAuthenticated, checkPermission("delete", "Delete recommendation template API"), deleteRecommendationTemplate)



module.exports = router;    