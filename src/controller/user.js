const bcrypt = require('bcrypt');
const User = require('../model/User');
const Workplace = require('../model/Workplace');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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
const { generateVerificationToken, sendVerificationEmail } = require('../utils/EmailSender');
const AppointmentInformation = require('../model/AppointmentInformation');
const PersonalHistory = require('../model/PersonalHistory');
const DietHistory = require('../model/DietHistory');
const pregnancyHistory = require('../model/pregnancyHistory');
const Observations = require('../model/Observations');
const MedicalHistory = require('../model/MedicalHistory');
const mongoose = require('mongoose');
const Client = require('../model/Client');
const eatingBehaviour = require('../model/eatingBehaviour');
const FoodDiares = require('../model/FoodDiares');
const Goals = require('../model/Goals');
const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const pdf = require('html-pdf');
const ClientFile = require('../model/ClientFile');
const html_to_pdf = require('html-pdf-node');
const Measurements = require('../model/Measurements');
const Lookup = require('../model/lookupUser');
const multer = require("../middleware/messageMiddleware");
const cloudinary = require("../db/cloudinary");
const UserRole = require('../model/Roles-Permission/UserRole');
const RolePermission = require('../model/Roles-Permission/RolePermission');
const { setUserRole } = require('./Role/userRoleController');
const Role = require('../model/Roles-Permission/Role');
const FoodDiary = require('../model/FoodDiary');
const Recommendation = require('../model/Recommendations');

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
      googleId,
      image,
      countryCode
    } = req.body;

    const salt = bcrypt.genSaltSync(10);
    let hashedPassword;

    if (googleId) {
      hashedPassword = ""
    } else {
      hashedPassword = await bcrypt.hashSync(password, salt);
    }

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: 'This email already exists',
      });
    }

    const clientExist = await Client.findOne({ email });

    if (clientExist) {
      const demoClient = await Client.findOne({ email, isDemoClient: true });
      if (demoClient) {
        return res.status(400).json({
          success: false,
          message: 'This email is already registered as a demo client and cannot be used to sign up.',
        });
      }
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
      googleId,
      image,
      role: "Admin",
      isDemoClient: false
    });

    const savedUser = await userData.save();
    savedUser.password = undefined;

    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      JWT_SECRET,
      // { expiresIn: '2h' }
    );

    if (workplace && countryCode) {
      const workplaceData = await new Workplace({
        name: workplace,
        userId: savedUser._id,
        country,
        countryCode,
      });
      await workplaceData.save();
    }
    await createSubscription(savedUser._id);
    await createProfessionalPreference(savedUser._id);
    await createPrivacyAndNotification(savedUser._id);
    await createBillingInformation(savedUser._id, req.body);
    const lookupEntry = new Lookup({
      userId: savedUser._id,
      timestamp: new Date(),
    });
    await lookupEntry.save();

    const defaultRole = await Role.findOne({ name: "Nutritionist" });
    let permissions = []
    if (defaultRole) {
      const userRole = new UserRole({
        userId: savedUser._id,
        roleId: defaultRole._id
      });
      await userRole.save()
      const roleIds = userRole.roleId

      const rolePermissions = await RolePermission.find({ roleId: { $in: roleIds } }).populate('permissionIds');

      rolePermissions.forEach((rp) => {
        rp.permissionIds.forEach((perm) => {
          permissions.push({
            action: perm.action,
            subject: perm.subject,
          });
        });
      });

      permissions = rolePermissions || []

    }

    return res.status(200).json({
      success: true,
      message: 'User Signup successfully',
      token: token,
      role: savedUser.role,
      permissions
    });
  } catch (error) {
    console.log("🚀 ~ SignUp ~ error:", error)
    next(error);
  }
};

const sendVerificationEmailHandler = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified.',
      });
    }

    const { token, name } = await generateVerificationToken(user);

    await sendVerificationEmail(user.email, token, name);

    return res.status(200).json({
      success: true,
      message: 'Verification email sent successfully. Please check your inbox.',
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.verificationEmailTokenExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired.',
      });
    }

    user.isEmailVerified = true;
    user.verificationEmailToken = undefined;
    user.verificationEmailTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Your email has been successfully verified.',
    });
  } catch (error) {
    next(error);
  }
};

const SignIn = async (req, res, next) => {
  try {
    const { email, password, isWebLogin, deviceToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    let userDetails = await User.findOne({ email });
    let isClient = false;

    if (!userDetails) {
      userDetails = await Client.findOne({ email });

      if (!userDetails) {
        return res.status(404).json({ message: 'User not found.' });
      }

      isClient = true;

      if (userDetails.isDemoClient) {
        return res.status(403).json({
          message: 'This is a demo client. Please use the demo login endpoint.',
          status: 403,
        });
      }

      const update = { $set: { isActive: 1 } };
      if (deviceToken && !userDetails.deviceToken.includes(deviceToken)) {
        update.$addToSet = { deviceToken: deviceToken };
      }

      await Client.updateOne({ email }, update);
      userDetails = await Client.findOne({ email });
    }

    const isPasswordMatch = await bcrypt.compare(password, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid Credentials', status: 400 });
    }

    if (isClient && isWebLogin) {
      return res.status(403).json({ message: 'Clients cannot log in from the web.', status: 403 });
    }

    const userId = isClient ? userDetails._id : userDetails._id;
    const token = jwt.sign(
      {
        id: isClient ? userDetails.userId : userDetails._id,
        role: isClient ? 'Client' : userDetails.role,
      },
      JWT_SECRET
    );

    const { password: _, ...userData } = userDetails._doc;

    let userRoles = await UserRole.find({ userId }).populate('roleId');

    if (isClient && userRoles.length === 0) {
      const clientRole = await Role.findOne({ name: 'Client' });
      if (clientRole) {
        await UserRole.create({ userId, roleId: clientRole._id });
        userRoles.push({ roleId: clientRole });
      }
    }

    const roleIds = userRoles.map((ur) => ur.roleId._id);
    const rolePermissions = await RolePermission.find({ roleId: { $in: roleIds } }).populate('permissionIds');

    const permissions = [];
    rolePermissions.forEach((rp) => {
      rp.permissionIds.forEach((perm) => {
        permissions.push({
          action: perm.action,
          subject: perm.subject,
        });
      });
    });

    return res.status(200).json({
      token,
      message: 'Login successful',
      status: 200,
      userData,
      permissions,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};




const SignOut = async (req, res, next) => {
  try {
    const { email, deviceToken } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required", status: 400 });
    }

    const user = await User.findOne({ email }) || await Client.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    if (user instanceof User) {
      await User.updateOne({ email }, { $set: { isActive: 0 } });
    } else {
      const update = { $set: { isActive: 0 } };

      if (deviceToken) {
        update.$pull = { deviceToken: deviceToken };
      } else {
        update.$set.deviceToken = [];
      }

      await Client.updateOne({ email }, update);
    }

    return res.status(200).json({ message: "Logout successful", status: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      error: error.message,
    });
  }
};


const demoAuth = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      country,
      goal,
      profession,
      phoneNumber,
      dateOfBirth,
      deviceToken,
      isDemoClient,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let client = await Client.findOne({ email });

    if (client) {
      // Block if existing client is NOT a demo client
      if (!client.isDemoClient && isDemoClient) {
        return res.status(403).json({
          message: 'This email is already registered as a regular client and cannot be used for demo access.',
        });
      }

      const isMatch = await bcrypt.compare(password, client.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (deviceToken) {
        client.deviceToken = deviceToken;
        await client.save();
      }

      const token = jwt.sign(
        { id: client._id, role: 'Client' },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      const { password: _, ...userData } = client._doc;

      return res.status(200).json({
        message: 'Signin successful',
        token,
        userData,
      });
    } else {
      if (isDemoClient) {
        if (
          !firstName || !lastName || !gender || !profession ||
          !goal || !country || !phoneNumber || !dateOfBirth
        ) {
          return res.status(400).json({ message: 'All fields are required for demo signup' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        client = await Client.create({
          fullName: `${firstName} ${lastName}`,
          email,
          password: hashedPassword,
          gender,
          occupation: profession,
          goal,
          country,
          phoneNumber,
          dateOfBirth,
          deviceToken: deviceToken || null,
          createdByClient: true,
          isDemoClient: true,
          isActive: 1,
        });

        const token = jwt.sign(
          { id: client._id, role: 'Client' },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        const { password: _, ...userData } = client._doc;

        return res.status(201).json({
          message: 'Signup successful',
          token,
          userData,
        });
      } else {
        return res.status(400).json({ message: 'Only demo users are allowed in this route' });
      }
    }
  } catch (error) {
    console.error('Demo Auth Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





const VerifyExistingUser = async (req, res, next) => {
  try {
    const { googleId, email, isWebLogin } = req.body;

    let userDetails = await User.findOne({ email: email });
    let isClient = false;

    if (!userDetails) {
      userDetails = await Client.findOne({ email: email });
      if (userDetails) {
        isClient = true
      } else {
        return res.status(404).json({ message: "User not found." });
      }
    }

    if (isClient && isWebLogin) {
      return res.status(403).json({ message: 'Clients cannot log in from the web' });
    }

    if (googleId && (!userDetails.googleId || userDetails.googleId !== googleId)) {
      userDetails.googleId = googleId;
      await userDetails.save();
    }

    if (googleId && googleId !== userDetails.googleId) {
      return res.status(400).json({ message: "Invalid Google ID.", status: 400 });
    }

    const token = jwt.sign(
      {
        id: isClient ? userDetails.userId : userDetails._id,
        role: isClient ? "Client" : userDetails.role,
      },
      JWT_SECRET,
      // { expiresIn: "2h" }
    );


    return res.status(200).json({
      token,
      message: "Login successfully",
      status: 200,
      user: userDetails,
      role: isClient ? "client" : userDetails.role
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const getUserProfile = async (req, res, next) => {
  try {
    const query = {
      _id: req.userId,

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
    if (req.file && req.file.path) {
      updatedFields.image = req.file.path;
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    if (user.image && req.file && req.file.path) {
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

    let user = await User.findOne({ email });
    let isClient = false;

    if (!user) {
      user = await Client.findOne({ email });
      isClient = true;
    }

    if (!user) {
      return res.status(404).json({ message: 'User or Client not found.' });
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
    const { token } = req.params;

    const password = req.body.password;
    const confirmPassword = req.body.cpassword;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirmation are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

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

    return res.status(200).json({ message: 'Password reset successful.', status: true });
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

const createClientByForm = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const userId = req.userId;

    const {
      appointmentReason, expectations, clinicGoals, clinicGoalsInfo, otherInfoA,
      bowelMovements, bowelMovementsInfo, sleepQuality, sleepQualityInfo, smoker,
      smokerInfo, alcoholConsumption, alcoholConsumptionInfo, maritalStatus,
      maritalStatusInfo, physicalActivity, race, otherInfoP, wakeupTime, bedTime,
      typeOfDiet, typeOfDietDetail, favoriteFood, dislikeFood, allergies,
      allergiesDetail, foodIntolerances, foodIntolerancesDetail, nutritionalDeficiencies,
      nutritionalDeficienciesDetail, waterTank, otherInfoD, typeOfRecord, gestationType,
      lastMenstrualPeriod, beginningOfLactation, observations, durationOfLactationInMonths,
      registrationDate, observation, diseases, diseasesDetail, medication, pesonalhistory,
      familyHistory, otherInfoM, islactation, isPregnant, height, weight

    } = req.body;

    // Validate Client ID
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ success: false, message: 'Invalid client ID' });
    }

    // Appointment Information Update
    const newAppointmentInfo = { userId, appointmentReason, expectations, clinicGoals, clinicGoalsInfo, otherInfo: otherInfoA };
    await AppointmentInformation.findOneAndUpdate({ clientId }, newAppointmentInfo, { new: true, upsert: true });

    // Personal History Update
    const newPersonalHistory = {
      userId, bowelMovements, bowelMovementsInfo, sleepQuality, sleepQualityInfo, smoker,
      smokerInfo, alcoholConsumption, alcoholConsumptionInfo, maritalStatus, maritalStatusInfo,
      physicalActivity, race, otherInfo: otherInfoP,
    };
    await PersonalHistory.findOneAndUpdate({ clientId }, newPersonalHistory, { new: true, upsert: true });

    // Diet History Update
    const newDietHistory = {
      userId, wakeupTime, bedTime, typeOfDiet, typeOfDietDetail, favoriteFood, dislikeFood,
      allergies, allergiesDetail, foodIntolerances, foodIntolerancesDetail,
      nutritionalDeficiencies, nutritionalDeficienciesDetail, waterTank, otherInfo: otherInfoD,
    };
    await DietHistory.findOneAndUpdate({ clientId }, newDietHistory, { new: true, upsert: true });



    // Format Date Helper
    const formatDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    // Process Pregnancy History if typeOfRecord exists
    if (typeOfRecord) {
      let currentPregnancyTrimester = null;
      let currentPregnancyWeek = null;
      let lactating = null;
      let status = '';

      const lmpDate = lastMenstrualPeriod ? new Date(lastMenstrualPeriod) : null;
      const lactationStartDate = beginningOfLactation ? new Date(beginningOfLactation) : null;
      const currentDate = new Date();

      if (typeOfRecord === 'Pregnancy and lactation') {
        if (!lastMenstrualPeriod || !beginningOfLactation || !durationOfLactationInMonths || durationOfLactationInMonths < 1) {
          return res.status(400).send({ message: 'Please provide all required fields for Pregnancy and Lactation with valid values.' });
        }

        const gestationalAgeInWeeks = (currentDate - lmpDate) / (1000 * 60 * 60 * 24 * 7);
        currentPregnancyTrimester = gestationalAgeInWeeks <= 13
          ? 'Trimester 1'
          : gestationalAgeInWeeks <= 26
            ? 'Trimester 2'
            : 'Trimester 3';

        currentPregnancyWeek = Math.ceil(gestationalAgeInWeeks);

        if (gestationalAgeInWeeks >= 40 && lactationStartDate) {
          const diffInMonths = (currentDate.getFullYear() - lactationStartDate.getFullYear()) * 12 + (currentDate.getMonth() - lactationStartDate.getMonth());
          const lactationMonthsRemaining = durationOfLactationInMonths - diffInMonths;
          status = lactationMonthsRemaining <= 0 ? 'completed' : '';
          lactating = lactationMonthsRemaining > 0 ? `month ${durationOfLactationInMonths - lactationMonthsRemaining}` : null;
        }
      }

      if (typeOfRecord === 'Pregnancy') {
        if (!lastMenstrualPeriod) return res.status(400).json({ message: 'lastMenstrualPeriod is required' });
        const gestationalAgeInWeeks = (currentDate - lmpDate) / (1000 * 60 * 60 * 24 * 7);
        currentPregnancyTrimester = gestationalAgeInWeeks <= 13
          ? 'Trimester 1'
          : gestationalAgeInWeeks <= 26
            ? 'Trimester 2'
            : 'Trimester 3';
        currentPregnancyWeek = Math.ceil(gestationalAgeInWeeks);
        status = gestationalAgeInWeeks >= 40 ? 'completed' : '';
      }

      if (typeOfRecord === 'Lactation') {
        if (!beginningOfLactation || !durationOfLactationInMonths) {
          return res.status(400).json({ message: 'beginningOfLactation and durationOfLactationInMonths are required' });
        }
        const diffInMonths = (currentDate.getFullYear() - lactationStartDate.getFullYear()) * 12 + (currentDate.getMonth() - lactationStartDate.getMonth());
        const lactationMonthsRemaining = durationOfLactationInMonths - diffInMonths;
        status = lactationMonthsRemaining <= 0 ? 'completed' : '';
        lactating = lactationMonthsRemaining > 0 ? `month ${durationOfLactationInMonths - lactationMonthsRemaining}` : null;
      }

      // Save Pregnancy History
      const newPregnancyHistory = new pregnancyHistory({
        userId,
        clientId,
        typeOfRecord,
        gestationType,
        lastMenstrualPeriod: formatDate(lastMenstrualPeriod),
        beginningOfLactation: formatDate(beginningOfLactation),
        durationOfLactationInMonths,
        observations,
        status,
        currentPregnancyTrimester,
        currentPregnancyWeek,
        lactating,
        islactation,
        isPregnant
      });

      await newPregnancyHistory.save();
    }

    // Observation
    if (observation) {
      const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const registrationDates = registrationDate ? registrationDate : formatDate(new Date())

      const newObservation = new Observations({ userId, registrationDate: registrationDates, observation, clientId, });
      await newObservation.save();
    }

    // Medical History Update
    const newMedicalHistory = { userId, diseases, diseasesDetail, medication, pesonalhistory, familyHistory, otherInfo: otherInfoM };
    await MedicalHistory.findOneAndUpdate({ clientId }, newMedicalHistory, { new: true, upsert: true });

    await Client.findOneAndUpdate(
      { _id: clientId },
      { $set: { createdByClient: true } },
      { new: true, upsert: true }
    );

    // Measurement Update
    const currentDate = new Date();
    const measurementDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    if (height || weight) {
      const newMeasurement = new Measurements({
        userId: userId,
        clientId: clientId,
        measurementsdate: measurementDate,
        measurements: [
          {
            measurementtype: 'Weight',
            entries: [
              {
                date: measurementDate,
                value: weight,
                unit: 'kg',
              },
            ],
          },
          {
            measurementtype: 'Height',
            entries: [
              {
                date: measurementDate,
                value: height,
                unit: 'cm',
              },
            ],
          },
        ],
      });

      const data = await newMeasurement.save();
    }

    res.status(200).json({ success: true, message: 'Client data processed successfully' });
  } catch (error) {
    next(error);
  }
};

const getPdfData = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    // const clientId = '67737c96e905d752c6e5322b';
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }
    const userId = req.userId;
    // const userId = '675a81c3d3014c082abbd96f'

    const appointmentInformation = await AppointmentInformation.find({ userId, clientId })
    const pregnancyhistory = await pregnancyHistory.find({
      clientId: clientId,
      userId: userId,
    });

    const observation = await Observations.find({ clientId: clientId, userId: userId });
    const Eatingbehaviours = await eatingBehaviour.find({ clientId: clientId, userId: userId });
    const foodDiaries = await FoodDiares.find({ clientId: clientId, userId: userId });
    const goalsData = await Goals.find({
      clientId: clientId,
      userId: userId
    });
    const personalSocialHistory = await PersonalHistory.find({ clientId: clientId, userId: userId });
    const medicalHistory = await MedicalHistory.find({ clientId: clientId, userId: userId });
    const dietHistory = await DietHistory.find({ clientId: clientId, userId: userId });
    const clientDatas = await Client.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(clientId),
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "workplaces",
          localField: 'workplaceId',
          foreignField: '_id',
          as: 'Workplaces',
          pipeline: [
            {
              $project: { 'name': 1, '_id': 0 }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$Workplaces",
          preserveNullAndEmptyArrays: true
        }
      },

    ])
    const userDatas = await User.findOne({ _id: userId });

    const clientData = {
      appointmentInformation,
      pregnancyhistory,
      observation,
      Eatingbehaviours,
      foodDiaries,
      goalsData,
      personalSocialHistory,
      medicalHistory,
      dietHistory,
      clientDatas,
      userDatas
    };

    const templatePath = path.join(__dirname, '../view/clientReport.ejs');
    const currentDate = new Date();
    const uploadPath = path.join(__dirname, '../uploads', `${req.body.name}_${currentDate.getSeconds()}.pdf`);

    try {
      const html = await ejs.renderFile(templatePath, { clientData: clientData });

      const options = {
        format: 'A4',
        path: uploadPath,
        printBackground: true,
      };

      const pdfBuffer = await html_to_pdf.generatePdf({ content: html }, options);

      fs.writeFileSync(uploadPath, pdfBuffer);

      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${currentDate.getFullYear()}`;

      const filePayload = {
        userId: userId,
        clientId: clientId,
        file: path.basename(uploadPath),
        name: req.body.name,
        date: formattedDate,
        category: 'Patient Informations',
      };

      const createFileDetailHelper = async (payload) => {
        try {
          const createdFile = await ClientFile.create(payload);
          return createdFile;
        } catch (error) {
          console.error("Error while saving file details:", error);
          throw new Error('Failed to save file details');
        }
      };

      const createdFileResponse = await createFileDetailHelper(filePayload);

      return res.status(200).json({
        success: true,
        message: 'PDF generated and file details saved successfully',
        pdfFilePath: uploadPath,
        createdFile: createdFileResponse,
      });
    } catch (error) {
      console.error("Error while generating PDF:", error);
      next(error);
    }



  } catch (error) {
    next(error);
  }
}

const printPdfData = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    // const clientId = '67737c96e905d752c6e5322b';
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }
    const userId = req.userId;
    // const userId = '675a81c3d3014c082abbd96f'

    const appointmentInformation = await AppointmentInformation.find({ userId, clientId })
    const pregnancyhistory = await pregnancyHistory.find({
      clientId: clientId,
      userId: userId,
    });

    const observation = await Observations.find({ clientId: clientId, userId: userId });
    const Eatingbehaviours = await eatingBehaviour.find({ clientId: clientId, userId: userId });
    const foodDiaries = await FoodDiares.find({ clientId: clientId, userId: userId });
    const goalsData = await Goals.find({
      clientId: clientId,
      userId: userId
    });
    const personalSocialHistory = await PersonalHistory.find({ clientId: clientId, userId: userId });
    const medicalHistory = await MedicalHistory.find({ clientId: clientId, userId: userId });
    const dietHistory = await DietHistory.find({ clientId: clientId, userId: userId });
    const mealPlan = await FoodDiary.find({ clientId: clientId, userId })
    const clientData = await Client.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(clientId),
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "workplaces",
          localField: 'workplaceId',
          foreignField: '_id',
          as: 'Workplaces',
          pipeline: [
            {
              $project: { 'name': 1, '_id': 0 }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$Workplaces",
          preserveNullAndEmptyArrays: true
        }
      },

    ])

    const recommendation = await Recommendation.find({ clientId, userId })
    const userDatas = await User.findOne({ _id: userId }, { email: 1, fullName: 1, profession: 1, phoneNumber: 1 });




    return res.status(200).json({ appointmentInformation, pregnancyhistory, observation, Eatingbehaviours, foodDiaries, goalsData, personalSocialHistory, medicalHistory, dietHistory, clientData, userDatas, mealPlan, recommendation });
  } catch (error) {
    next(error);
  }
}

const getUser = async (req, res, next) => {
  try {

    const userId = req.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User retrieved successfully", data: user })

  } catch (error) {
    console.log("🚀 ~ getUser ~ error:", error)
  }
}

const uploadMessage = async (req, res, next) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (req.file.mimetype.startsWith("image/")) {
      cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ url: result.secure_url });
      });
    } else if (req.file.mimetype.startsWith("application/")) {
      res.json({ url: `${req.file.filename}` });
    } else {
      res.status(400).json({ error: "Invalid file type" });
    }
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error)

  }
}

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json(users)
  } catch (err) {
    return res.status(500).json({ message: "Error fetching users" });
  }
}

const sendMailMealplan = async (req, res) => {
  try {
    const userId = req.userId;
    const clientId = req.params.id;
    const { message: emailBody, category, subject, fullName } = req.body;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });


    const formattedBody = emailBody
      .split('\n')
      .map(line => `<p>${line.trim()}</p>`)
      .join('');

    let attachments = [];
    if (file) {
      attachments.push({
        filename: file.originalname,
        path: file.secure_url || file.path,
      });
    }



    const mailOptions = {
      from: `"${user.fullName}" <${user.email}>`,
      to: client.email,
      subject: subject || "Your Personalized Meal Plan",
      html: formattedBody,
      attachments,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ message: "Internal server error" });
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
  sendVerificationEmailHandler,
  verifyEmail,
  VerifyExistingUser,
  createClientByForm,
  getPdfData,
  printPdfData,
  getUser,
  uploadMessage,
  SignOut,
  demoAuth,
  getAllUser,
  sendMailMealplan
};
