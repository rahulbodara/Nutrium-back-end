const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { createProfessionalPreference,getprofessionPreference } = require('../controller/professionalpreference');

router.post('/create-preference', isAuthenticated, createProfessionalPreference);

router.get('/get-preference',isAuthenticated, getprofessionPreference);

module.exports = router;