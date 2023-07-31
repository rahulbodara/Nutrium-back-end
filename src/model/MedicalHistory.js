const mongoose = require('mongoose');
const medicalHistorySchema = new mongoose.Schema({
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
      enum: [
        'Anaemia',
        'Angina',
        'Celiac disease',
        'Dyslipidaemia',
        'Gastritis',
        'Heart disease',
        'High cholesterol',
        'Hypertension',
        'IBD',
        'Kidney disease',
        'Musculoskeletal problem',
        'Obesity',
        'Peripheral artery disease',
        'Previous MI',
        'Previous stroke',
        'Type 1 Diabetes',
        'Type 2 Diabetes',
      ],
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

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
