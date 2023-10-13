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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name:{
                type: mongoose.Schema.Types.ObjectId,
                ref : 'Food'
              } 
            },
          ],
        },
      ],
      Appetizer: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
              }
            },
          ],
        },
      ],
      Dish: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
              },
            },
          ],
        },
      ],
      Dessert: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
              },
            },
          ],
        },
      ],
      Beverage: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
              },
            },
          ],  
        },
      ],
      Soup: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
              },
            },
          ],  
        },
      ],
      Firstcourse: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
              },
            },
          ],  
        },
      ],
      Secondcourse: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
              },
            },
          ],  
        },
      ],
      Sidedish: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
              },
            },
          ],  
        },
      ],
      Others: [
        {
          name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
          },
          subfoods: [
            {
              name: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
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
    enum: ['Merge selected days into a single version', 'Create a version for each day','single day'],
    default: 'single day',
  },
  copyMealPlan: {
    type: [String],
    default: 'Do not copy',
  }
});

module.exports = mongoose.model('Mealplan', mealPlanSchema);
