const express = require('express');
const userRoute = express.Router();
const userController = require('../controller/user');
const multer = require('multer');
const { isAuthenticated } = require('../middleware/auth');

const upload = multer({ dest: 'src/uploads/' });

userRoute.post('/sign_up', upload.single('image'), userController.SignUp);
userRoute.post('/sign_in', userController.SignIn);
userRoute.get('/professionals', isAuthenticated, userController.getUserProfile);
userRoute.put(
  '/professionals',
  upload.single('image'),
  isAuthenticated,
  userController.UpdateProfile
);
userRoute.post('/forget-password', userController.forgotPassword);
userRoute.post('/resetPassword', userController.resetPassword);
userRoute.delete(
  '/delete-account',
  isAuthenticated,
  userController.deleteUserProfile
);

module.exports = userRoute;
