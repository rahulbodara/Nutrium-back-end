const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { createProfessionalPreference } = require('../controller/professionalpreference');

router.post('/create-preference', isAuthenticated, createProfessionalPreference);

module.exports = router;