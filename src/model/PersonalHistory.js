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
  },
  sleepQualityInfo: {
    type: String,
  },
  smoker: {
    type: String,
  },
  smokerInfo: {
    type: String,
  },
  alcoholConsumption: {
    type: String,
  },
  alcoholConsumptionInfo: {
    type: String,
  },
  maritalStatus: {
    type: String,
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
