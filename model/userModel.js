const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'please enter a email'],
    unique: [true, 'email already exist'],
  },
  password: {
    type: String,
    required: true,
    minimum: [8, 'password must be atlease 8 digits'],
  },
});
