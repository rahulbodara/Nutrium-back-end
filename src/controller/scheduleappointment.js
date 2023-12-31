const Appointment = require("../model/ScheduleApointment");
const mongoose = require("mongoose");
const videoConsultationValues = {
  without_video_call: "Not available in this option",
  google_meet: "Generated after saving appointment",
  zoom: "Generated after saving appointment",
};

const createAppointment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      status,
      videoConsultation,
      start,
      end,
      schedulingNotes,
      newStartTime,
      newEndTime,
      clientId,
      workplace,
      clientName
    } = req.body;


    const appointment = new Appointment({
      userId,
      status,
      start: start,
      end: end,
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
    const userId = req.userId;
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const getallappointments = await Appointment.aggregate([
      {
        $match: { userId: userIdObj },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      }
    ])

    return res.status(200).json({
      success: true,
      getallappointments,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAppointementDescription = async (req, res, next) => {
  try {
    const userId = req.userId;
    const appointments = await Appointment.find({ userId: userId,status:'completed' });

    if (!appointments) {
      return res.status(404).json({ message: "Appointment not found!" });
    }

    const maxStartDateByClient = appointments.reduce((acc, appointment) => {
      const { clientId, start } = appointment;

      if (acc[clientId]) {
        if (new Date(acc[clientId].start) < new Date(start)) {
          acc[clientId] = appointment;
        }
      } else {
        acc[clientId] = appointment;
      }

      return acc;
    }, {});

    const filteredAppointments = Object.values(maxStartDateByClient);

    return res.status(200).json({
      success: true,
      filteredAppointments,
    });
  } catch (error) {
    console.error("Error getting appointment:", error);
    next(error);
  }
}


const updateAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const {
      status,
      videoConsultation,
      schedulingNotes,
      start,
      end
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

const deleteAppointment = async (req, res, next) => {
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

const updateAppointementStatus = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    const appointment = await Appointment.findById({ _id: appointmentId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found!" });
    }
    appointment.status = status;

    const updatedAppointment = await appointment.save();
    res.status(200).json({ success: true, message: 'Appointment updated successfully', data: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    next(error);
  }
}

const updateStartAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById({ _id: appointmentId });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found!" });
    }
    appointment.isStarted = true;
    await appointment.save();
    res.status(200).json({ success: true, message: 'Appointment updated successfully' });
  } catch (error) {
    console.error("Error updating appointment:", error);
    next(error);
  }
}

const getStartedAppointments = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const getStartedAppointments = await Appointment.aggregate([
      {
        $match: {
          userId: userIdObj,
          status: "not_confirmed",
          isStarted: true,
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      getStartedAppointments,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


module.exports = {
  updateAppointment,
  createAppointment,
  getAllAppointments,
  deleteAppointment,
  updateAppointementStatus,
  getAppointementDescription,
  updateStartAppointment,
  getStartedAppointments
};
