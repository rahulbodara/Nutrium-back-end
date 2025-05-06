const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { addFoodAvoidTemplate, fetchFoodAvoidTemplates, GetAllFoodAvoidTamplate, EditFoodAvoid, DeleteFoodAvoidTamplate, getFoodAvoidTemplateId } = require('../controller/FoodToAvoid');
const { checkPermission } = require('../middleware/checkPermission');
const router = express.Router();

router.post("/addFoodAvoidTamplate", isAuthenticated, checkPermission("create", "Create food avoid template API"), addFoodAvoidTemplate)
router.get("/food-avoid-tamplate", isAuthenticated, checkPermission('read', "Get my food avoid template API"), fetchFoodAvoidTemplates)
router.get("/all-avoid-food-tamplate", isAuthenticated, checkPermission('read', 'Get all food avoid template API'), GetAllFoodAvoidTamplate)
router.put("/edit-food-avoid-template/:id", isAuthenticated, checkPermission("update", "Update food avoid template API"), EditFoodAvoid)
router.delete("/delete-food-avoid-template/:id", isAuthenticated, checkPermission("delete", "Delete food avoid template API"), DeleteFoodAvoidTamplate)
router.get("/get-avoid-food-template/:id", isAuthenticated, checkPermission("read", "Get avoid food template by template id API"), getFoodAvoidTemplateId)

module.exports = router;