const mongoose = require('mongoose');

const mealPlanSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'user',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'Clients',
  },
  name: String,
  time: String,
  foods: [
    {
      name: String,
      subfoods: [
        {
          name: String,
        },
      ],
    },
  ],
  notes: String,
  days: {
    type: [String],
    default: ['Every Day'],
  },
  creationMethod: {
    type: String,
    enum: ['Merge selected days into a single version', 'Create a version for each day'],
    default: 'Merge selected days into a single version',
  },
  copyMealPlan: {
    type:String,
    default: 'Do not copy'
  },
});

module.exports = mongoose.model('Mealplan', mealPlanSchema);
