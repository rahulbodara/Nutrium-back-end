const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { fetchFoodDiary ,addMealInDiary, updateTimeAndCommentInDiary } = require('../controller/client/foodDiary');
const upload = require('../middleware/imageHandler');

const router = express.Router();

router.get('/food-diary/:clientId', fetchFoodDiary);
router.post('/food-diary-add-meal/:clientId',upload.single('photo'), addMealInDiary);
router.put("/food-diary/:clientId/meal/:mealId", isAuthenticated, updateTimeAndCommentInDiary);

module.exports = router;