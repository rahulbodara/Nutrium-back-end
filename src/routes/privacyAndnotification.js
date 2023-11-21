const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {createPrivacyAndNotification,getPrivacyAndNotification,updatePrivacyAndNotifications} = require('../controller/privacyAndnotification');

router.post('/createPrivacyAndNotification', isAuthenticated, createPrivacyAndNotification);

router.get('/getPrivacyAndNotification', isAuthenticated, getPrivacyAndNotification);

router.put('/updatePrivacyAndNotification', isAuthenticated, updatePrivacyAndNotifications);

module.exports = router;