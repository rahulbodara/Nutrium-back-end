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
      meal: String,
      time: String,
      foods: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
            },
          ],
        },
      ],
      Appetizer: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
            },
          ],
        },
      ],
      Dish: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
            },
          ],
        },
      ],
      Dessert: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
            },
          ],
        },
      ],
      Beverage: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
            },
          ],
        },
      ],
      Soup: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
            },
          ],
        },
      ],
      Firstcourse: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
            },
          ],
        },
      ],
      Secondcourse: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
            },
          ],
        },
      ],
      Sidedish: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
            },
          ],
        },
      ],
      Others: [
        {
          name: {
            type: String
          },
          source: {
            type: String
          },
          group: {
            type: String
          },
          quantity: {
            type: String
          },
          foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
          },
          subfoods: [
            {
              name: {
                type: String
              },
              source: {
                type: String
              },
              group: {
                type: String
              },
              quantity: {
                type: String
              },
              foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food'
              },
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
    enum: ['Merge selected days into a single version', 'Create a version for each day', 'single day'],
    default: 'single day',
  },
  copyMealPlan: {
    type: [String],
    default: 'Do not copy',
  }
});

module.exports = mongoose.model('Mealplan', mealPlanSchema);
