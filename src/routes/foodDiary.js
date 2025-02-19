const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const {
    createFoodDiary,
} = require('../controller/client/foodDiary');
const router = express.Router();

router.post('/food-diary', createFoodDiary);


module.exports = router;