const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  start: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["confirmed", "not_confirmed"],
    default: "not_confirmed",
  },
  videoConsultation: {
    type: String,
    enum: ["without_video_call", "google_meet", "zoom", "other_service"],
    required: true,
  },
  end: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 30 * 60 * 1000);
    },
  },
  workplace: { type: String, required: true },
  schedulingNotes: { type: String, default: "" },
  videoLink: { type: String, default: "" },
});

const ScheduleApointment = mongoose.model("Appointment", appointmentSchema);

module.exports = ScheduleApointment;
