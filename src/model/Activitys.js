const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Client', 
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed, 
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;

