const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  createMealTemplate,
  addNewMeal,
  createVersion
} = require('../controller/mealTemplate');

// Routes for Meal Plans
router.post('/createMealTemplate',isAuthenticated, createMealTemplate);
router.post('/addNewMeal', addNewMeal);
router.post('/createVersion', createVersion);

module.exports = router;

