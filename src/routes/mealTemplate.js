const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  createMealTemplate,
  addNewMeal,
  createVersion,
  getMealTemplate,
  getMealTemplateById
} = require('../controller/mealTemplate');

// Routes for Meal Plans
router.post('/createMealTemplate',isAuthenticated, createMealTemplate);
router.get('/get-meal-templet', isAuthenticated, getMealTemplate);
router.get('/get-meal-templet/:id', isAuthenticated, getMealTemplateById);
router.post('/addNewMeal', addNewMeal);
router.post('/createVersion', createVersion);

module.exports = router;

