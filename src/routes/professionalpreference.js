const express = require('express');
const router = express.Router();
const { createProfessionalPreference, getprofessionPreference, updateprofessionPreference } = require('../controller/professionalpreference');
const { isAuthenticated } = require('../middleware/auth');

router.post('/create-preference', createProfessionalPreference);

router.get('/get-preference', isAuthenticated, getprofessionPreference);

router.put('/update-preference', isAuthenticated, updateprofessionPreference);

module.exports = router;