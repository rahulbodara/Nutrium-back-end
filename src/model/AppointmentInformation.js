const mongoose = require('mongoose');
const validator = require('validator');

const appointmentInfo = mongoose.Schema({
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
  appointmentReason: {
    type: String,
  },
  expectations: {
    type: String,
  },
  clinicGoals: [
    {
      type: String,
    },
  ],
  otherInfo: {
    type: String,
  },
});

module.exports = mongoose.model('AppointmentInformation', appointmentInfo);
