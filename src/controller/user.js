const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../model/User');
const Workplace = require('../model/Workplace');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require('fs');

const SignUp = async (req, res, next) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const {
      fullName,
      email,
      password,
      gender,
      country,
      dateOfBirth,
      phoneNumber,
      profession,
      nutrium,
      workplace,
      expertise,
      clientPerMonth,
      university,
      courseEndDate,
      professionCardNumber,
      zipcode,
    } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const exist = await User.findOne({ email });

    if (exist) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'This email already exists',
      });
    }

    let userData;
    if (profession === 'Student') {
      userData = new User({
        fullName,
        email,
        password: hashedPassword,
        gender,
        country,
        dateOfBirth,
        phoneNumber,
        profession,
        nutrium,
        university,
        courseEndDate,
        professionCardNumber,
        zipcode,
      });
    } else {
      userData = new User({
        fullName,
        email,
        password: hashedPassword,
        gender,
        country,
        dateOfBirth,
        phoneNumber,
        profession,
        nutrium,
        expertise,
        clientPerMonth,
        professionCardNumber,
        zipcode,
      });
    }

    const savedUser = await userData.save({ session });
    // console.log('saveUser---------------------->', savedUser._id);

    if (workplace) {
      const workplaceData = new Workplace({
        name: workplace,
        userId: savedUser._id,
        country,
      });
      // console.log('workplace------------------------>', workplaceData);
      await workplaceData.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: 'User Signup successfully',
      userData: savedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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

const UpdateProfile = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      fullName,
      email,
      gender,
      country,
      dateOfBirth,
      phoneNumber,
      profession,
      professionCardNumber,
      zipcode,
    } = req.body;

    const userId = req.userId;
    const user = await User.findById(userId).session(session);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.image) {
      fs.unlink(user.image, async (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    user.fullName = fullName;
    user.email = email;
    user.gender = gender;
    user.country = country;
    user.dateOfBirth = dateOfBirth;
    user.phoneNumber = phoneNumber;
    user.profession = profession;
    user.professionCardNumber = professionCardNumber;
    user.zipcode = zipcode;
    if (req.file) {
      user.image = req.file.path;
    }

    await user.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

module.exports = { SignUp, SignIn, getUserProfile, UpdateProfile };
