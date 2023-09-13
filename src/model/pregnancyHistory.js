const mongoose = require('mongoose');

const pregnancyHistorySchema = new mongoose.Schema({
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
  typeOfRecord: {
    type: String,
    enum: ['Pregnancy and lactation', 'Pregnancy', 'Lactation'],
  },
  gestationType: {
    type: String,
    enum: [
      'Single pregnancy',
      'Multiple pregnancy',
    ],
  },
  lastMenstrualPeriod: {
    type: Date,
  },
  beginningOfLactation: {
    type: Date,
  },
  durationOfLactationInMonths: {
    type: Number,
  },
  observations: {
    type: String,
  }
},
{
    timestamps:true
});

module.exports = mongoose.model('pregnancyHistory', pregnancyHistorySchema);
