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

const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
      user.token = token;
      const { password, ...userdetails } = user._doc;
      return res.status(200).json({
        token: token,
        message: 'Login successfully',
        status: 200,
        userdetails,
      });
    } else {
      return res
        .status(400)
        .send({ message: 'Invalid Credentials', status: 400 });
    }
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User Not Found!' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const UpdateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const {
      fullName,
      email,
      gender,
      country,
      DOB,
      Number,
      profession,
      nutrium,
      zipcode,
    } = req.body;

    const user = await User.findById(id);
    if (user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user._id !== userId) {
      return res.status(403).json({ message: 'Unauthorized User' });
    }
    if (user.image) {
      fs.unlink(user.image, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    user.fullName = fullName;
    user.email = email;
    user.gender = gender;
    user.country = country;
    user.DOB = DOB;
    user.Number = Number;
    user.profession = profession;
    user.nutrium = nutrium;
    user.wokplace = wokplace;
    user.zipcode = zipcode;

    const updatedUserData = await user.save();

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      userData: updatedUserData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { SignUp, SignIn, getUserProfile, UpdateProfile };
