const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  ingredient: [{
    type: String,
    ref: "foods",
    required: true,
  }],
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
