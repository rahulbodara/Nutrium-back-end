const mongoose = require("mongoose");

const RecipeInformation = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  authorName: {
    type: String,
  },
  authorImages: {
    type: String,
  },
  category: {
    type: Array
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
  like: {
    type: Number,
    default: 0
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
    type: Array,
    default: [""]
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
  ],
  website: {
    type: Boolean,
    default: false
  },
  community: {
    type: Boolean,
    default: false
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ]
});

const RecipeData = mongoose.model("Recipe", RecipeInformation);

module.exports = RecipeData;
