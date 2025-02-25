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
  deleteDayInTemplate,
  deleteFoodInTemplate,
  deleteMealScheduleInTemplate,
  featchMealPlanForClient,
  createNote,
  chnageTemplateName
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
router.post('/deleteFoodInTemplate', isAuthenticated, deleteFoodInTemplate);
router.post('/deleteMealScheduleInTemplate', isAuthenticated, deleteMealScheduleInTemplate);
router.post('/meal-plan-createNote', isAuthenticated, createNote);
router.post('/meal-plan-chnageTemplateName', isAuthenticated, chnageTemplateName);

router.get('/meal-plan/:clientId', featchMealPlanForClient);

module.exports = router;

