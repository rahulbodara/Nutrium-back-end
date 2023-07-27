const express = require('express');
const router = express.Router();
const groupController = require('../controller/group');
const { isAuthenticated } = require("../middleware/auth");

router.get('/group-options', isAuthenticated,groupController.getGroupOptions);

module.exports = router;