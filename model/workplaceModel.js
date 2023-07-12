const mongoose = require('mongoose');

const workplaceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  color: {
    type: String,
  },
  address: {
    type: String,
  },
  addressStatus: {
    type: String,
  },
});

module.exports = mongoose.model('workplace', workplaceSchema);
