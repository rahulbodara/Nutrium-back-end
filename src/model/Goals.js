const mongoose = require('mongoose');
const validator = require('validator');

const goalsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Clients',
    },

    goalType: {
      type: String,
      required: true,
      enum: [
        'Generic (Sports and food routines, among others)',
        'Measured (Anthropometric data, Analytical Data, Body Composition)',
      ],
    },
    description: {
      type: String,
      required: [true, 'This field is required.'],
    },
    deadline: {
      type: String,
      required: [true, 'Please enter Registration date'],
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
        message: 'Please enter a valid date in the format (DD/MM/YYYY)',
      },
    },
    measurementType: {
      type: String,
      required: function () {
        return (
          this.goalType !== 'Generic (Sports and food routines, among others)'
        );
      },
    },
    value: {
      type: String,
      required: function () {
        return (
          this.goalType !== 'Generic (Sports and food routines, among others)'
        );
      },
    },
    unit: {
      type: String,
      required: function () {
        return (
          this.goalType !== 'Generic (Sports and food routines, among others)'
        );
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goals', goalsSchema);
