const express = require('express');
const router = express.Router();
const {
  createMealTemplate,
  createVersion
} = require('../controller/mealTemplate');

// Routes for Meal Plans
router.post('/mealPlans', createMealTemplate);
router.post('/createVersion', createVersion);


module.exports = router;
