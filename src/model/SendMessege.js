const mongoose = require("mongoose");

const sendMessegeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sendTo: {
    type: String,
    enum: ["Tags", "Workplace", "Clients"],
    required: true,
  },
  category: {
    type: String,
    enum: ["Appointment", "Follow up", "Meal plan", "Question"],
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  attachedFiles: {
    type: Array,
    of: String,
  },
});

const SendMessege = mongoose.model("SendMessege", sendMessegeSchema);

module.exports = SendMessege;
