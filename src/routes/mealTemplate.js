const express = require('express');
const router = express.Router();
const {
  createMealTemplate,
  getMealTemplate
} = require('../controller/mealTemplate');

// Routes for Meal Plans
router.post('/mealPlans', createMealTemplate);
router.post('/getMealTemplate', getMealTemplate);


module.exports = router;
