const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const appointmentPrefSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Non Confirmed'],
      required: true,
    },
    time_value: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('appointmentPrefrence', appointmentPrefSchema);
