const express = require('express');
const userRoute = express.Router();
const userController = require('../controller/user');
const multer = require('multer');
const { isAuthenticated } = require('../middleware/auth');
const { createPersonalDetail } = require('../controller/personalPage');
const upload = require('../middleware/imageHandler');
const uploadMessage = require('../middleware/messageMiddleware');
const { checkPermission } = require('../middleware/checkPermission');


userRoute.post('/sign_up', upload.single('image'), userController.SignUp);
userRoute.post('/sign_in', userController.SignIn);
userRoute.post('/sign_out', isAuthenticated, userController.SignOut)
userRoute.post('/verify-google', userController.VerifyExistingUser);
userRoute.post('/send-verification-email', userController.sendVerificationEmailHandler);
userRoute.get('/verify-email', userController.verifyEmail);
userRoute.get('/professionals', isAuthenticated, userController.getUserProfile);
userRoute.put(
  '/professionals',
  upload.single('image'),
  isAuthenticated,
  userController.UpdateProfile
);
userRoute.post('/forget-password', userController.forgotPassword);
userRoute.post('/reset-password/:token', userController.resetPassword);
userRoute.delete(
  '/delete-account',
  isAuthenticated,
  checkPermission("delete", "Delete User"),
  userController.deleteUserProfile
);
userRoute.put('/professionals/website', isAuthenticated, createPersonalDetail);

userRoute.post('/createClientByForm/:clientId', isAuthenticated, userController.createClientByForm)

userRoute.get('/getFormData/:clientId', isAuthenticated, checkPermission("read", "Print PDF of client data"), userController.printPdfData)

userRoute.get('/getUser', isAuthenticated, checkPermission('read', 'Get user data'), userController.getUser);

userRoute.post('/upload', uploadMessage.single("file"), userController.uploadMessage);

userRoute.post('/demo-auth', userController.demoAuth)

userRoute.get('/user', userController.getAllUser)

module.exports = userRoute;
