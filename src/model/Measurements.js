const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
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
  measurementsdate: {
    type: String,
  },
  measurements: [
    {
      measurementtype: {
        type: String,
      },
      entries: [
        {
          date: {
            type: String,
          },
          value: {
            type: String,
          },
          unit: {
            type: String,
          },
        },
      ],
    },
  ],
  bmiGoalWeight:{
    type: String,
    default : null,
  },
  bmiFlag :{
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Measurements', measurementSchema);
