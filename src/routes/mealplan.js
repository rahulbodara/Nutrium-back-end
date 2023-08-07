const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { createMealPlan } = require('../controller/mealplan');

router.post('/meal-plan', isAuthenticated, createMealPlan);

module.exports = router;
