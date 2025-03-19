const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { addFoodAvoidTemplate, fetchFoodAvoidTemplates, GetAllFoodAvoidTamplate, EditFoodAvoid, DeleteFoodAvoidTamplate, getFoodAvoidTemplateId } = require('../controller/FoodToAvoid');
const router = express.Router();

router.post("/addFoodAvoidTamplate", isAuthenticated, addFoodAvoidTemplate)
router.get("/food-avoid-tamplate", isAuthenticated, fetchFoodAvoidTemplates)
router.get("/all-avoid-food-tamplate", isAuthenticated, GetAllFoodAvoidTamplate)
router.put("/edit-food-avoid-template/:id", isAuthenticated, EditFoodAvoid)
router.delete("/delete-food-avoid-template/:id", isAuthenticated, DeleteFoodAvoidTamplate)
router.get("/get-avoid-food-template/:id", isAuthenticated, getFoodAvoidTemplateId)

module.exports = router;