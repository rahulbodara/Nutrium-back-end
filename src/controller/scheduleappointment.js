const Appointment = require("../model/ScheduleApointment");

const videoConsultationValues = {
  without_video_call: "Not available in this option",
  google_meet: "Generated after saving appointment",
  zoom: "Generated after saving appointment",
};

const createAppointment = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { clientName,status, videoConsultation, workplace,schedulingNotes } =
      req.body;
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    let updatedVideoLink = "";

    if (videoConsultation === "other_service") {
      updatedVideoLink = "Add here the video call link";
    } else {
      updatedVideoLink = videoConsultationValues[videoConsultation];
    }

    const appointment = new Appointment({
      clientName,
      start,
      status,
      videoConsultation,
      end,
      workplace,
      schedulingNotes,
      videoLink: updatedVideoLink,
    });

    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    next(error);
  }
};
const updateAppointment = async (req, res, next) => {
    try {
      const { appointmentId, status, videoConsultation, schedulingNotes, newStartTime } = req.body;
  
      const appointment = await Appointment.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found!" });
      }
  
      appointment.status = status;
      appointment.videoConsultation = videoConsultation;
      appointment.schedulingNotes = schedulingNotes;
  
      const start = new Date(newStartTime);
      const end = new Date(start.getTime() + 30 * 60 * 1000); 
  
      appointment.start = start;
      appointment.end = end;
  
      const updatedAppointment = await appointment.save();
      res.status(200).json(updatedAppointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      next(error);
    }
  };
  
module.exports = {
  createAppointment,
  updateAppointment
};
