const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  createMealTemplate,
  addNewMeal,
  createVersion,
  getMealTemplate,
  getMealTemplateById,
  deleteMealTemplate,
  addFoodInTemplate,
  updateTimeAndSubMealTypeName,
  deleteDayInTemplate
} = require('../controller/mealTemplate');

// Routes for Meal Plans
router.post('/createMealTemplate',isAuthenticated, createMealTemplate);
router.get('/get-meal-templet', isAuthenticated, getMealTemplate);
router.get('/get-meal-templet/:id', isAuthenticated, getMealTemplateById);
router.delete('/delete-meal-templet/:id', isAuthenticated, deleteMealTemplate);
router.post('/addNewMeal', addNewMeal);
router.post('/createVersion', createVersion);
router.post('/addFoodInTemplate', isAuthenticated, addFoodInTemplate);
router.post('/updateMealPlanInTemplate', isAuthenticated, updateTimeAndSubMealTypeName);
router.post('/deleteDayinTemplate', isAuthenticated, deleteDayInTemplate);

module.exports = router;

