const mongoose = require("mongoose");

const RecipeInformation = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  image: {
    required: true,
    type: String,
  },
  name: { type: String, required: true },
  description: {
    required: true,
    type: String,
  },
  totalTime: {
    required: true,
    type: String,
  },
  preparationTime: {
    required: true,
    type: String,
  },
  finalWeight: {
    required: true,
    type: Number,
  },
  portions: {
    required: true,
    type: Number,
  },
});

const RecipeData = mongoose.model("Recipe", RecipeInformation);

module.exports = RecipeData;
