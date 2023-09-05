const mongoose = require('mongoose');
const { isEmail } = require('validator');

const secretariesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please enter a full name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  workplace: {
    type: String,
    required: true,
  },
  image:{
    type: String,
  },
  isActive: {
    type: Number,
    default: 1,
  },
});

const Secretaries = mongoose.model('Secretaries', secretariesSchema);

module.exports = Secretaries;
