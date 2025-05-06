// routes/masterModelRoutes.js

const express = require('express');
const { getMasterModels } = require('../controller/masterModelController');
const { isAuthenticated } = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const router = express.Router();

router.get('/mastermodel', isAuthenticated, checkPermission("read", "Get master model API"), getMasterModels);

module.exports = router;
