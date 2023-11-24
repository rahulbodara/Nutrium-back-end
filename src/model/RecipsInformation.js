const mongoose = require("mongoose");

const RecipeInformation = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  image: {
    type: String,
  },
  name: {
    type: String,
    default: "Recipe"
  },
  description: {
    type: String,
  },
  totalTime: {
    type: String,
  },
  preparationTime: {
    type: String,
  },
  finalWeight: {
    type: Number,
  },
  portions: {
    type: Number,
  },
  ingredients: {
    foods: [
      {
        name: {
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
  },
  cookingMethod: {
    type: Array
  },
  commonMeasures: [
    {
      singularName: {
        type: String,

      },
      pluralName: {
        type: String,

      },
      quantity: {
        type: Number,

      },
      totalGrams: {
        type: Number,

      },
      ediblePortion: {
        type: Number,

      },
    },
  ]
});

const RecipeData = mongoose.model("Recipe", RecipeInformation);

module.exports = RecipeData;
