const bcrypt = require('bcrypt');
const User = require('../model/userModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const SignUp = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(password, salt);

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: 'This email already exists',
      });
    }

    const signup = new user({
      email,
      fullName,
      password: hashedPassword,
    });

    const userData = await signup.save();
    return res.status(200).json({
      success: true,
      message: 'User Signup successfully',
      userData,
    });
  } catch (error) {
    next(error);
  }
};
