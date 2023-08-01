const mongoose = require('mongoose');

const measurementSchema = mongoose.Schema({
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
  measurementsDate: {
    type: String,
    required: [true, 'Please enter Registration date'],
    validate: {
      validator: function (value) {
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
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
  weight: {
    type: Number,
  },
  weight: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  height: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  hipCircumference: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  waistCircumference: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  diastolicBloodPressure: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  hdlCholesterol: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  ldlCholesterol: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  systolicBloodPressure: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  totalCholesterol: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  triglycerides: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  bodyFatPercentage: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  fatMass: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  muscleMass: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  muscleMassPercentage: [
    {
      date: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('Measurements', measurementSchema);
