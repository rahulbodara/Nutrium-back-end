const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  isEnabled: { type: Boolean, required: true, default: false },
  startTime: { type: String, default: "9:00 AM" },
  endTime: { type: String, default: "5:00 PM" },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
