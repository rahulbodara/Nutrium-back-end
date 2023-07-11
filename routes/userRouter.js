const express = require('express');
const userRoute = express.Router();
const userController = require('../controller/userController');
const multer = require('multer');
const { isAuthenticated } = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

userRoute.post(
  '/accounts/sign_up',
  upload.single('image'),
  userController.SignUp
);
userRoute.post('/accounts/sign_in', userController.SignIn);
userRoute.get('/professionals', isAuthenticated, userController.getUserProfile);

module.exports = userRoute;
