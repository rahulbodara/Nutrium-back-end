const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { createMealPlan,getMealPlan,updateMealPlan } = require('../controller/mealplan');

router.post('/meal-plan/:clientId', isAuthenticated, createMealPlan);

router.get('/getMeal-plan/:clientId', isAuthenticated, getMealPlan);

router.put('/updateMeal-plan/:mealId', isAuthenticated, updateMealPlan);

module.exports = router;
