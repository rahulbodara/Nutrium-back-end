const express = require('express');
const userRoute = express.Router();
const userController = require('../controller/user');
const multer = require('multer');
const { isAuthenticated } = require('../middleware/auth');
const { createPersonalDetail } = require('../controller/personalPage');

const upload = multer({ dest: 'src/uploads/' });

userRoute.post('/sign_up', upload.single('image'), userController.SignUp);
userRoute.post('/sign_in', userController.SignIn);
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
  userController.deleteUserProfile
);
userRoute.put('/professionals/website', isAuthenticated, createPersonalDetail);

module.exports = userRoute;
