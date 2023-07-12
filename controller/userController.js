const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const Workplace = require('../model/workplaceModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const SignUp = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      gender,
      country,
      DOB,
      Number,
      profession,
      nutrium,
      workplace,
      expertise,
      clientPerMonth,
      university,
      courseEndDate,
      zipcode,
      professionCardNumber,
    } = req.body;

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(password, salt);

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: 'This email already exists',
      });
    }

    let userData;
    if (profession === 'Student') {
      userData = await new User({
        fullName,
        email,
        password: hashedPassword,
        gender,
        country,
        zipcode,
        DOB,
        Number,
        profession,
        nutrium,
        university,
        courseEndDate,
        professionCardNumber,
      });
    } else {
      userData = await new User({
        fullName,
        email,
        password: hashedPassword,
        gender,
        country,
        zipcode,
        DOB,
        Number,
        profession,
        nutrium,
        expertise,
        clientPerMonth,
        professionCardNumber,
      });
    }

    const savedUser = await userData.save();
    if (workplace) {
      const workplaceData = await new Workplace({
        name: fullName,
        country,
        phone: Number,
        user: savedUser._id,
        color: null,
        zipcode,
        address: null,
        addressStatus: null,
      });
      await workplaceData.save();
    }
    return res.status(200).json({
      success: true,
      message: 'User Signup successfully',
      userData: savedUser,
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
    const userId = req.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User Not Found!' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { SignUp, SignIn, getUserProfile };
