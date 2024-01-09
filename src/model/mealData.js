const mongoose = require("mongoose");

const MealPlanData = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  weightgms: {
    type: String,
  },
  weightDetails: {
    type: String,
  },
  description: {
    type: String,
  },
  detailsData: {
    type: String,
  },
  energy: {
    type: String,
  },
  fat: {
    type: String,
  },
  carbohydrates: {
    type: String,
  },
  protein: {
    type: String,
  },
});

module.exports = mongoose.model("MealData", MealPlanData);
