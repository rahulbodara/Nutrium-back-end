const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { addFoodAvoidTemplate, fetchFoodAvoidTemplates, GetAllFoodAvoidTamplate } = require('../controller/FoodToAvoid');
const router = express.Router();

router.post("/addFoodAvoidTamplate", isAuthenticated, addFoodAvoidTemplate)
router.get("/food-avoid-tamplate", isAuthenticated, fetchFoodAvoidTemplates)
router.get("/all-avoid-food-tamplate", isAuthenticated, GetAllFoodAvoidTamplate)

module.exports = router;