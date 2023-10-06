const mongoose = require('mongoose');

const mealPlanSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clients',
  },
  mealPlans: [
    {
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
      Appetizer: [
        {
          name: String,
          subfoods: [
            {
              name: String,
            },
          ],
        },
      ],
      Dish: [
        {
          name: String,
          subfoods: [
            {
              name: String,
            },
          ],
        },
      ],
      Dessert: [
        {
          name: String,
          subfoods: [
            {
              name: String,
            },
          ],
        },
      ],
      Beverage: [
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
    },
  ],
  days: {
    type: [String],
    default: ['Every Day'],
  },
  creationMethod: {
    type: String,
    enum: ['Merge selected days into a single version', 'Create a version for each day','single day'],
    default: 'single day',
  },
  copyMealPlan: {
    type: [String],
    default: 'Do not copy',
  }
});

module.exports = mongoose.model('Mealplan', mealPlanSchema);
