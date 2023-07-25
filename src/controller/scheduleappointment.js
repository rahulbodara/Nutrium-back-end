const Appointment = require("../model/ScheduleApointment");

const videoConsultationValues = {
  without_video_call: "Not available in this option",
  google_meet: "Generated after saving appointment",
  zoom: "Generated after saving appointment",
};

const updateAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const {
      status,
      videoConsultation,
      schedulingNotes,
      newStartTime,
      newEndTime,
    } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found!" });
    }
    let updatedVideoLink = "";

    if (videoConsultation === "other_service") {
      updatedVideoLink = "Add here the video call link";
    } else {
      updatedVideoLink = videoConsultationValues[videoConsultation];
    }
    appointment.status = status;
    appointment.videoConsultation = videoConsultation;
    appointment.schedulingNotes = schedulingNotes;

    const start = new Date(newStartTime);
    const end = new Date(newEndTime);

    appointment.start = start;
    appointment.end = end;
    appointment.videoLink = updatedVideoLink;

    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    next(error);
  }
};

module.exports = {
  updateAppointment,
};
