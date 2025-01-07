const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  createMealTemplate,
  addNewMeal
} = require('../controller/mealTemplate');

// Routes for Meal Plans
router.post('/createMealTemplate',isAuthenticated, createMealTemplate);
router.post('/addNewMeal', addNewMeal);

module.exports = router;

