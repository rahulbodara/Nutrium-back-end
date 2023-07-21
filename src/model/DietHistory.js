const mongoose = require('mongoose');

const dietHistorySchema = new mongoose.Schema({
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
  wakeupTime: {
    type: String,
  },
  bedTime: {
    type: String,
  },
  typeOfDiet: [
    {
      type: String,
    },
  ],
  typeOfDietDetail: {
    type: String,
  },
  favoriteFood: {
    type: String,
  },
  dislikeFood: {
    type: String,
  },
  allergies: [
    {
      type: String,
    },
  ],
  allergiesDetail: {
    type: String,
  },
  foodIntolerances: [
    {
      type: String,
    },
  ],
  foodIntolerancesDetail: {
    type: String,
  },
  nutritionalDeficiencies: [
    {
      type: String,
    },
  ],
  nutritionalDeficienciesDetail: {
    type: String,
  },
  waterTank: {
    type: String,
  },
  otherInfo: {
    type: String,
  },
});

module.exports = mongoose.model('dietHistory', dietHistorySchema);
