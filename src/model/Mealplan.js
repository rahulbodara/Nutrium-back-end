const mongoose = require('mongoose');

const mealPlanSchema = mongoose.Schema({
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
  days: {
    type: [String],
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
  creationMethod: {
    type: String,
    enum: [
      'Merge selected days into a single version',
      'Create a verion for each day',
    ],
  },
  associatePlanning: [
    {
      planning: {
        type: String,
      },
    },
  ],
  copyMealsPlan: {
    type: String,
  },

});

module.exports = mongoose.model('Mealplan', mealPlanSchema);
