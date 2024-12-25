const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  allDay: {
    type: Boolean,
    required: true,
    default: false,
  },
  blockCalendar: {
    type: Boolean,
    default: false,
    required: true
  },
  googleCalendar: {
    type: Boolean,
    required: true,
    default: false
  }

});

module.exports = mongoose.model("Event", eventSchema);
