const mongoose = require("mongoose");

const RecipeCooking = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },

  cookingMethod: { type: String, required: true },
});

const RecipeCookingData = mongoose.model("RecipeCooking", RecipeCooking);

module.exports = RecipeCookingData;
