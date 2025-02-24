const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { fetchFoodDiary } = require('../controller/client/foodDiary');

const router = express.Router();

router.get('/food-diary/:clientId', fetchFoodDiary);

module.exports = router;