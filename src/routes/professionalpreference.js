const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { createProfessionalPreference,getprofessionPreference,updateprofessionPreference } = require('../controller/professionalpreference');

router.post('/create-preference', createProfessionalPreference);

router.get('/get-preference',isAuthenticated, getprofessionPreference);

router.put('/update-preference',isAuthenticated,updateprofessionPreference);

module.exports = router;