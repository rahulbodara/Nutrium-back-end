const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please enter your name'],
      maxLength: [30, 'Name cannot exceed 30 charaters'],
      minLength: [4, 'Name should have more then 4 charaters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [8, 'Password should be greater then 8 charaters'],
    },
    image: {
      type: String,
    },
    zipcode: {
      type: Number,
    },
    gender: {
      type: String,
      required: [true, 'Please select a gender'],
      enum: ['Male', 'Female', 'Others'],
    },
    country: {
      type: String,
      required: [true, 'Please select a country'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Please enter a date of birth'],
      validate: {
        validator: function (value) {
          const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-([12][0-9]|0[1-9]|3[01])$/;
          if (!dateRegex.test(value)) {
            return false;
          }
          const parts = value.split('-');
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const day = parseInt(parts[2], 10);
          const date = new Date(year, month - 1, day);
          return (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          );
        },
        message: 'Please enter a valid date of birth (YYYY-MM-DD)',
      },
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Please enter a Mobile Number'],
    },
    profession: {
      type: String,
      required: [true, 'Please select a profession'],
      enum: [
        'Nutritionist',
        'Dietitian',
        'Nutritional therapist',
        'Health Coach',
        'Student',
        'Other',
      ],
    },
    professionCardNumber: {
      type: Number,
    },
    nutrium: {
      type: String,
      required: [true, 'Please select What are you looking for in Nutrium?'],
    },
    workplace: {
      type: String,
      required: [true, 'Please enter a Your Work Place'],
    },
    expertise: {
      type: Array,
      required: function () {
        return this.profession !== 'Student';
      },
    },
    clientPerMonth: {
      type: String,
      required: function () {
        return this.profession !== 'Student';
      },
    },
    courseEndDate: {
      type: String,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
    presentation: {
      type: String,
    },
    aboutMe: {
      type: String,
    },
    url: [
      {
        platform: {
          type: String,
        },
        link: {
          type: String,
        },
      },
    ],
    privacyStatus: {
      type: String,
      default: 'Private',
    },
    isActive: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('users', userSchema);
