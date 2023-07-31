const mongoose = require('mongoose');

const personalHistorySchema = new mongoose.Schema({
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
  bowelMovements: {
    type: String,
    enum: ['Normal', 'Constipation', 'Diarrhea', 'Irregular'],
  },
  bowelMovementsInfo: {
    type: String,
  },
  sleepQuality: {
    type: String,
    enum: [
      'Less than 5 hours/night',
      'About 5 hours/night',
      'About 6 hours/night',
      'About 7 hours/night',
      'About 8 hours/night',
      'About 9 hours/night',
      'About 10 hours/night',
      'More than 5 hours/night',
    ],
  },
  sleepQualityInfo: {
    type: String,
  },
  smoker: {
    type: String,
    enum: ['Yes', 'No'],
  },
  smokerInfo: {
    type: String,
  },
  alcoholConsumption: {
    type: String,
    enum: ['Yes', 'No'],
  },
  alcoholConsumptionInfo: {
    type: String,
  },
  maritalStatus: {
    type: String,
    enum: ['Married', 'Single', 'Divorced', 'Widower'],
  },
  maritalStatusInfo: {
    type: String,
  },
  physicalActivity: {
    type: String,
  },
  race: {
    type: String,
    enum: ['Caucasian', 'Black', 'Asian'],
  },
  otherInfo: {
    type: String,
  },
});

module.exports = mongoose.model('PersonalHistory', personalHistorySchema);
