const mongoose = require("mongoose");

const CalenderSettngSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  birthdaySystem: {
    type: String,
    required: true,
    enum: ["Do not show on calender", "Show on calender"],
  },
  appointmentRequestSystem: {
    type: String,
    required: true,
    enum: ["Enabled", "Disabled"],
  },
});
const CalenderSetting = mongoose.model("CalenderSetting", CalenderSettngSchema);

module.exports = CalenderSetting;
