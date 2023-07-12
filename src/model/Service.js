const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  typeOfService: {
    type: String,
    required: true,
  },
  typeOfClients: {
    type: String,
    required: true,
  },
  nameOfService: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  pricing: {
    type: String,
    required: true,
  },
  workplace: {
    type: String,
    required: true,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
