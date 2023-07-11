const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please enter a full name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
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
  },
  country: {
    type: String,
    required: [true, 'Please select a country'],
  },
  DOB: {
    type: String,
    required: [true, 'Please enter a date of birth'],
  },
  mobileNumber: {
    type: String,
    validate: {
      validator: function (value) {
        return /^[0-9]+$/.test(value);
      },
      message: 'Please enter a valid mobile number',
    },
  },
  profession: {
    type: String,
    required: [true, 'Please select a profession'],
  },
  professionCardNumber: {
    type: Number,
  },
  nutrium: {
    type: String,
    required: [true, 'Please select What are you looking for in Nutrium?'],
  },
  wokplace: {
    type: String,
  },
  expertise: {
    type: Array,
  },
  clientPerMonth: {
    type: String,
  },
  university: {
    type: String,
  },
  courseEndDate: {
    type: String,
  },
});

module.exports = mongoose.model('user', userSchema);
