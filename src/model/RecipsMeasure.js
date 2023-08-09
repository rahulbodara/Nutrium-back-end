const mongoose = require("mongoose");

const measureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  singularName: { type: String, required: true },
  pluralName: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalGrams: { type: Number, required: true },
  ediblePortion: { type: Number, required: true },
});

const Measure = mongoose.model("Measure", measureSchema);

module.exports = Measure;
