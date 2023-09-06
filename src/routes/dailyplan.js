const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { createDailyPlan} = require('../controller/dailyplan');

router.post('/createPlan/:clientId', isAuthenticated, createDailyPlan);

module.exports = router;
