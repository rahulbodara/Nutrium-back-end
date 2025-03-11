const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { fetchFoodDiary ,addMealInDiary, updateTimeAndCommentInDiary, deleteFoodFromDiary } = require('../controller/client/foodDiary');
const upload = require('../middleware/imageHandler');

const router = express.Router();

router.get('/food-diary/:clientId', fetchFoodDiary);
router.post('/food-diary-add-meal/:clientId',upload.single('photo'), addMealInDiary);
router.put("/food-diary/:clientId", isAuthenticated, updateTimeAndCommentInDiary);
router.delete('/food-diary/:clientId/delete-food', isAuthenticated, deleteFoodFromDiary);


module.exports = router;