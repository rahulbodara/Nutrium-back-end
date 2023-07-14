const mongoose = require("mongoose");

const systemPreference = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  timeZone: {
    name: {
      type: String,
      required: true,
    },
    offset: {
      type: String,
      required: true,
    },  
  },
  language: {
    type: String,
    enum: [
      "European Portuguese",
      "English",
      "Brazilian Portuguese",
      "Spanish",
      "French",
      "Italian",
      "German",
    ],
    required: true,
  },
  weightUnit: {
    type: String,
    enum: ["Kilogram", "Pound", "Stone"],
    required: true,
  },
  lengthUnit: {
    type: String,
    enum: ["Centimeters", "Foot and Inch"],
    required: true,
  },
  energyUnit: {
    type: String,
    enum: ["Kilocalorie", "Kilojoule"],
    required: true,
  },
  volumeUnit: {
    type: String,
    enum: ["Liter", "Fluid Ounce"],
    required: true,
  },
  distanceUnit: {
    type: String,
    enum: ["Kilometer", "Mile"],
    required: true,
  },
  statisticMeasure: {
    type: String,
    enum: ["Kilometer", "Mile"],
    required: true,
  },
});

const SystemPrefernce = mongoose.model("SystemPrefernce", systemPreference);

module.exports = SystemPrefernce;
