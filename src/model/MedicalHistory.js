const mongoose = require('mongoose');
const medicalHistorySchema = mongoose.Schema({
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
  diseases: [
    {
      type: String,
    },
  ],
  diseasesDetail: {
    type: String,
  },
  medication: {
    type: String,
  },
  pesonalhistory: {
    type: String,
  },
  familyHistory: {
    type: String,
  },
  otherInfo: {
    type: String,
  },
});

module.exports = mongoose.model('medicalHistory', medicalHistorySchema);
