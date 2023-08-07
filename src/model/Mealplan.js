const mongoose = require('mongoose');

const mealPlanSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  days: [
    {
      day: {
        type: String,
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
      dailyPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dailyplans',
      },
    },
  ],
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
  copyMealsPlan: [
    {
      copyMeal: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('Mealplan', mealPlanSchema);
