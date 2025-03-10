const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { fetchFoodDiary ,addMealInDiary } = require('../controller/client/foodDiary');
const upload = require('../middleware/imageHandler');

const router = express.Router();

router.get('/food-diary/:clientId', fetchFoodDiary);
router.post('/food-diary-add-meal/:clientId',upload.single('photo'), addMealInDiary);

module.exports = router;