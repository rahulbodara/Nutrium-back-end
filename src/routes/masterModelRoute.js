// routes/masterModelRoutes.js

const express = require('express');
const { getMasterModels } = require('../controller/masterModelController');
const router = express.Router();

router.get('/mastermodel', getMasterModels);

module.exports = router;
