const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
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
  isActive: {
    type: Number,
    default: 1,
  },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
