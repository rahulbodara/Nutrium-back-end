const mongoose = require("mongoose");

const workplaceSchema = new mongoose.Schema({
  startTime: { type: String, default: "9:00 AM" },
  endTime: { type: String, default: "5:00 PM" },
  workplaceName: { type: String, required: true }, // New field
});


const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user', // Reference to the User model
  },
  schedules: [
    {
      day: {
        type: String,
        required: true,
        enum: [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
      },
      isEnabled: { type: Boolean, required: true, default: false },
      workplace: [workplaceSchema], // Array of workplace objects
    },
  ],
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
