const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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
});

module.exports = mongoose.model('Measurements', measurementSchema);
