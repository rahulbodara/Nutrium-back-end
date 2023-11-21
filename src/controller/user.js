const bcrypt = require('bcrypt');
const User = require('../model/User');
const Workplace = require('../model/Workplace');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require('fs');
const createSubscription = require('./subscription').createSubscription;
const createProfessionalPreference = require('./professionalpreference').createProfessionalPreference;
const createPrivacyAndNotification = require('./privacyAndnotification').createPrivacyAndNotification;
const createBillingInformation =
  require('./billinginformation').createBillingInformation;
const { generateResetToken, sendEmail } = require('../utils/EmailSender');
const Service = require('../model/Service');
const Secretaries = require('../model/Secretaries');

const SignUp = async (req, res, next) => {
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
      courseEndDate,
      professionCardNumber,
      zipcode,
    } = req.body;

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = await bcrypt.hashSync(password, salt);

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: 'This email already exists',
      });
    }

    const userData = await new User({
      fullName,
      email,
      password: hashedPassword,
      gender,
      country,
      dateOfBirth,
      phoneNumber,
      profession,
      nutrium,
      workplace,
      expertise,
      clientPerMonth,
      courseEndDate,
      professionCardNumber,
      zipcode,
    });

    const savedUser = await userData.save();
    savedUser.password = undefined;

    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    if (workplace) {
      const workplaceData = await new Workplace({
        name: workplace,
        userId: savedUser._id,
        country,
      });
      await workplaceData.save();
    }
    await createSubscription(savedUser._id);
    await createProfessionalPreference(savedUser._id);
    await createPrivacyAndNotification(savedUser._id);
    await createBillingInformation(savedUser._id, req.body);
    return res.status(200).json({
      success: true,
      message: 'User Signup successfully',
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }
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
          expiresIn: '2h',
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
    console.log(error);
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const query = {
      _id: req.userId,
      isActive: 1,
    };

    const user = await User.findOne(query).select('-password');

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
    const updatedFields = {
      fullName,
      email,
      gender,
      country,
      dateOfBirth,
      phoneNumber,
      profession,
      professionCardNumber,
      zipcode,
    };

    if (req.file) {
      updatedFields.image = req.file.filename;
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    if (user.image && req.file) {
      fs.unlink(user.image, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { token, name } = await generateResetToken(user);

    await sendEmail(email, token, name);

    return res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    next(error.message);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;

    const password = req.body.password;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired token.' });
    }

    if (user.resetToken === null) {
      return res.status(400).json({ message: 'Token has already been used.' });
    }

    if (user.resetTokenExpires <= new Date()) {
      return res.status(400).json({ message: 'Token has expired.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
  
    next(error.message);
  }
};

const deleteUserProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const password = req.body.password;

    const user = await User.findOneAndUpdate(
      { _id: userId, isActive: 1 },
      { $set: { isActive: 0 } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (user.image) {
      fs.unlink(user.image, async (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    await Workplace.updateMany(
      { userId: userId, isActive: 1 },
      { $set: { isActive: 0 } }
    );
    await Service.updateMany(
      { userId: userId, isActive: 1 },
      { $set: { isActive: 0 } }
    );
    await Secretaries.updateMany(
      { userId: userId, isActive: 1 },
      { $set: { isActive: 0 } }
    );

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  SignUp,
  SignIn,
  getUserProfile,
  UpdateProfile,
  forgotPassword,
  resetPassword,
  deleteUserProfile,
};
