const mongoose = require('mongoose');
const validator = require('validator');

const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    fullName: {
      type: String,
      required: [true, 'Please enter your name'],
      maxLength: [30, 'Name cannot exceed 30 charaters'],
      minLength: [4, 'Name should have more then 4 charaters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      // unique: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    gender: {
      type: String,
      required: [true, 'Please select a gender'],
      enum: ['Male', 'Female', 'Others'],
    },
    workplace: {
      type: String,
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Please enter a date of birth'],
      validate: {
        validator: function (value) {
          const dateRegex =
            /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
          if (!dateRegex.test(value)) {
            return false;
          }
          const parts = value.split('/');
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          const date = new Date(year, month - 1, day);
          return (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          );
        },
        message: 'Please enter a valid date of birth (DD/MM/YYYY)',
      },
    },

    image: {
      type: String,
    },
    occupation: {
      type: String,
    },
    tags: {
      type: String,
    },
    country: {
      type: String,
      required: [true, 'Please select a country'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Please enter a Mobile Number'],
    },
    address: {
      type: String,
    },
    zipcode: {
      type: Number,
    },
    processNumber: {
      type: Number,
    },
    nationalNumber: {
      type: Number,
    },
    healthNumber: {
      type: Number,
    },
    vatNumber: {
      type: Number,
    },
    isActive: {
      type: Number,
      default: 1,
    },
    isImported:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Clients', clientSchema);
