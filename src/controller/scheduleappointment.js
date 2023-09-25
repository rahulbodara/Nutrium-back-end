const Appointment = require("../model/ScheduleApointment");

const videoConsultationValues = {
  without_video_call: "Not available in this option",
  google_meet: "Generated after saving appointment",
  zoom: "Generated after saving appointment",
};

const createAppointment = async (req, res, next) => {
  try {
    const {
      status,
      videoConsultation,
      schedulingNotes,
      newStartTime,
      newEndTime,
      clientId,
      workplace,
      clientName
    } = req.body;
    const appointment = new Appointment({
      status,
      videoConsultation,
      schedulingNotes,
      newStartTime,
      newEndTime,
      clientId,
      workplace,
      clientName
    });

    const result = await appointment.save();

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating appointment:", error);
    next(error);
  }
};

const getAllAppointments = async (req, res, next) => {
  try {
    const getallappointments = await Appointment.find();

    return res.status(200).json({
      success: true,
      getallappointments,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
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

const deleteAppointment = async(req,res,next) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found!" });
    }

    await appointment.deleteOne();
    res.status(200).json({ message: "Appointment deleted!" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    next(error);
  }
}


module.exports = {
  updateAppointment,
  createAppointment,
  getAllAppointments,
  deleteAppointment,
};
