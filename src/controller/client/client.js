const Client = require("../../model/Client");
const fs = require("fs");
const mongoose = require("mongoose");
const AppointmentInformation = require("../../model/AppointmentInformation");
const PersonalHistory = require("../../model/PersonalHistory");
const Observations = require("../../model/Observations");
const MedicalHistory = require("../../model/MedicalHistory");
const DietHistory = require("../../model/DietHistory");
const createAppointment = require("../../model/ScheduleApointment");
const registerClient = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      fullName,
      gender,
      workplace,
      dateOfBirth,
      phoneNumber,
      email,
      occupation,
      country,
      zipcode,
    } = req.body;

    const exist = await Client.findOne({ email });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "This email already exists",
      });
    }
    const clientData = await new Client({
      userId: userId,
      fullName,
      gender,
      workplace,
      dateOfBirth,
      phoneNumber,
      email,
      occupation,
      country,
      zipcode,
    });
    const client = await clientData.save();
    return res.status(200).json({
      success: true,
      message: "client added successfully",
      client,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllClient = async (req, res, next) => {
  try {
    const query = {
      userId: req.userId,
      isActive: 1,
    };
    const client = await Client.find(query);
    if (!client) {
      return res.status(404).json({ message: "client Not Found!" });
    }
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// const getClientByID = async (req, res, next) => {
//   try {
//     const query = {
//       _id: req.params.id,
//       userId: req.userId,
//       isActive: 1,
//     };
//     const client = await Client.findOne(query);
//     if (!client) {
//       return res.status(404).json({ message: 'client Not Found!' });
//     }
//     res.status(200).json(client);
//   } catch (error) {
//     next(error);
//   }
// };

const getClientByID = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const userId = req.userId;

    const query = {
      _id: clientId,
      userId: userId,
      isActive: 1,
    };
    const client = await Client.findOne(query);
    if (!client) {
      return res.status(404).json({ message: "client Not Found!" });
    }

    const aggregate = [
      {
        $lookup: {
          from: "appointmentinformations",
          localField: "_id",
          foreignField: "clientId",
          as: "appointmentInformation",
        },
      },
      {
        $lookup: {
          from: "personalhistories",
          localField: "_id",
          foreignField: "clientId",
          as: "Personal and social history",
        },
      },
      {
        $lookup: {
          from: "diethistories",
          localField: "_id",
          foreignField: "clientId",
          as: "Dietary history",
        },
      },
      {
        $lookup: {
          from: "medicalhistories",
          localField: "_id",
          foreignField: "clientId",
          as: "Medical history",
        },
      },
      {
        $lookup: {
          from: "observations",
          localField: "_id",
          foreignField: "clientId",
          as: "observations",
        },
      },
      {
        $lookup: {
          from: "createAppointment",
          localField: "_id",
          foreignField: "clientId",
          as: "Create Appointment",
        },
      },
      {
        $lookup: {
          from: 'clientfiles',
          localField: '_id',
          foreignField: 'clientId',
          as: 'files',
        },
      },
    ];

    const results = await Client.aggregate(aggregate);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const {
      fullName,
      gender,
      workplace,
      dateOfBirth,
      phoneNumber,
      email,
      occupation,
      country,
      zipcode,
      address,
      tags,
      processNumber,
      nationalNumber,
      healthNumber,
      vatNumber,
    } = req.body;

    const updatedFields = {
      fullName,
      gender,
      workplace,
      dateOfBirth,
      phoneNumber,
      email,
      occupation,
      country,
      zipcode,
      address,
      tags,
      processNumber,
      nationalNumber,
      healthNumber,
      vatNumber,
    };

    if (req.file) {
      updatedFields.image = req.file.filename;
    }

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (client.image && req.file) {
      fs.unlink(client.image, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      updatedFields,
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Client1 not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client details updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const getAppointmentInfo = async (req, res, next) => {
  try {
    const query = {
      _id: req.params.id,
      userId: req.userId,
      isActive: 1,
    };
    const client = await Client.findOne(query);
    if (!client) {
      return res.status(404).json({ message: "Client Not Found!" });
    }
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const videoConsultationValues = {
      without_video_call: "Not available in this option",
      google_meet: "Generated after saving appointment",
      zoom: "Generated after saving appointment",
    };

    let updatedVideoLink = "";

    if (videoConsultation === "other_service") {
      updatedVideoLink = "Add here the video call link";
    } else {
      updatedVideoLink = videoConsultationValues[videoConsultation];
    }
    const clientName = client.fullName;
    const clientWorkplace = client.workplace;

    const appointmentData = {
      clientId: client._id,
      clientName,
      start,
      status: "not_confirmed",
      videoConsultation: "without_video_call",
      end,
      workplace: clientWorkplace,
      schedulingNotes: "Add scheduling notes here if needed",
      videoLink: updatedVideoLink,
    };

    const appointment = new createAppointment(appointmentData);

    const savedAppointment = await appointment.save();

    return res.status(201).json(savedAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const deletedClient = await Client.findOneAndUpdate(
      { _id: clientId, isActive: 1 },
      { $set: { isActive: 0 } },
      { new: true }
    );

    if (deletedClient) {
      res.status(200).json({ message: "Client deleted successfully" });
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateAppointmentInfo = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const { appointmentReason, expectations, clinicGoals, otherInfo } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const userId = req.userId;
    const newAppointmentInfo = {
      userId: userId,
      appointmentReason,
      expectations,
      clinicGoals,
      otherInfo,
    };

    const updatedAppointmentInfo =
      await AppointmentInformation.findOneAndUpdate(
        { clientId: clientId },
        newAppointmentInfo,
        { new: true, upsert: true }
      );

    const message = updatedAppointmentInfo._id
      ? "Appointment Information updated successfully"
      : "New Appointment Information created";

    return res.status(200).json({
      success: true,
      message: message,
      appointment: updatedAppointmentInfo,
    });
  } catch (error) {
    next(error);
  }
};

const updatePersonalHistory = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const {
      bowelMovements,
      bowelMovementsInfo,
      sleepQuality,
      sleepQualityInfo,
      smoker,
      smokerInfo,
      alcoholConsumption,
      alcoholConsumptionInfo,
      maritalStatus,
      maritalStatusInfo,
      physicalActivity,
      race,
      otherInfo,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    const userId = req.userId;
    const newPersonalHistory = {
      userId: userId,
      bowelMovements,
      bowelMovementsInfo,
      sleepQuality,
      sleepQualityInfo,
      smoker,
      smokerInfo,
      alcoholConsumption,
      alcoholConsumptionInfo,
      maritalStatus,
      maritalStatusInfo,
      physicalActivity,
      race,
      otherInfo,
    };

    const updatedPersonalHistory = await PersonalHistory.findOneAndUpdate(
      { clientId: clientId },
      newPersonalHistory,
      { new: true, upsert: true }
    );

    const message = updatedPersonalHistory._id
      ? "Personal History updated successfully"
      : "New Personal History created";

    return res.status(200).json({
      success: true,
      message: message,
      personalHistory: updatedPersonalHistory,
    });
  } catch (error) {
    next(error);
  }
};

const updateObservation = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const { registrationDate, observation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }
    const userId = req.userId;
    const newObservation = {
      userId: userId,
      registrationDate,
      observation,
    };
    const updatedObservation = await Observations.findOneAndUpdate(
      { clientId: clientId },
      newObservation,
      { new: true, upsert: true }
    );

    const message = updatedObservation._id
      ? "Observation updated successfully"
      : "New Observation created";

    return res.status(200).json({
      success: true,
      message: message,
      observation: updatedObservation,
    });
  } catch (error) {
    next(error);
  }
};

const deleteObservation = async (req, res, next) => {
  try {
    const observationId = req.params.id;
    const clientId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(observationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid observation ID",
      });
    }

    const deletedObservation = await Observations.findByIdAndDelete(
      clientId,
      { _id: observationId },
      { new: true }
    );

    if (!deletedObservation) {
      return res.status(404).json({
        success: false,
        message: "Observation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Observation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateMedicalHistory = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const {
      diseases,
      diseasesDetail,
      medication,
      personalHistory,
      familyHistory,
      otherInfo,
    } = req.body;

    const userId = req.userId;
    const newMedicalHistory = {
      userId: userId,
      diseases,
      diseasesDetail,
      medication,
      personalHistory,
      familyHistory,
      otherInfo,
    };

    const updatedMedicalHistory = await MedicalHistory.findOneAndUpdate(
      { clientId: clientId },
      newMedicalHistory,
      { new: true, upsert: true }
    );

    const message = updatedMedicalHistory._id
      ? "Medical History updated successfully"
      : "New Medical History created";

    return res.status(200).json({
      success: true,
      message: message,
      medicalHistory: updatedMedicalHistory,
    });
  } catch (error) {
    next(error);
  }
};

const updateDietHistory = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const {
      wakeupTime,
      bedTime,
      typeOfDiet,
      typeOfDietDetail,
      favoriteFood,
      dislikeFood,
      allergies,
      allergiesDetail,
      foodIntolerances,
      foodIntolerancesDetail,
      nutritionalDeficiencies,
      nutritionalDeficienciesDetail,
      waterTank,
      otherInfo,
    } = req.body;

    const userId = req.userId;
    const newDietHistory = {
      userId: userId,
      wakeupTime,
      bedTime,
      typeOfDiet,
      typeOfDietDetail,
      favoriteFood,
      dislikeFood,
      allergies,
      allergiesDetail,
      foodIntolerances,
      foodIntolerancesDetail,
      nutritionalDeficiencies,
      nutritionalDeficienciesDetail,
      waterTank,
      otherInfo,
    };

    const updatedDietHistory = await DietHistory.findOneAndUpdate(
      { clientId: clientId },
      newDietHistory,
      { new: true, upsert: true }
    );

    const message = updatedDietHistory._id
      ? "Diet History updated successfully"
      : "New Diet History created";

    return res.status(200).json({
      success: true,
      message: message,
      dietHistory: updatedDietHistory,
    });
  } catch (error) {
    next(error);
  }
};

const createFileDetail = async (req, res, next) => {
  try {
    const { name, description, date, category } = req.body;
    const userId = req.userId;
    const clientId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'You need to choose a file',
      });
    }

    const newFile = {
      userId: userId,
      clientId: clientId,
      file: file.filename,
      name: name,
      description: description,
      date: date,
      category: category,
    };

    const createdFile = await ClientFile.create(newFile);

    return res.status(201).json({
      success: true,
      message: 'File created successfully',
      file: createdFile,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

const updateFileDetail = async (req, res, next) => {
  try {
    const userId = req.userId;
    const fileId = req.params.id;
    const { name, description, date, category } = req.body;
    const newFile = {
      userId: userId,
      _id: fileId,
      file: req.file.filename,
      name: name,
      description: description,
      date: date,
      category: category,
    };

    const updatedFile = await ClientFile.findOneAndUpdate(
      { _id: fileId },
      newFile,
      { new: true, upsert: true }
    );

    const message = updatedFile._id
      ? 'File updated successfully'
      : 'New File created';

    return res.status(200).json({
      success: true,
      message: message,
      file: updatedFile,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

const deleteFileDetail = async (req, res, next) => {
  try {
    const fileId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file ID',
      });
    }

    const deletedFile = await ClientFile.findByIdAndDelete({ _id: fileId });

    if (!deletedFile) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.log('error--------->', error);
    next(error);
  }
};

const getAllFileDetail = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    console.log('clientId---------->', clientId);

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }

    const files = await ClientFile.find({ clientId: clientId });

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Files not found for the client',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Files retrieved successfully',
      files: files,
    });
  } catch (error) {
    console.log('error--------->', error);
    next(error);
  }
};

module.exports = {
  registerClient,
  deleteClient,
  getClientByID,
  getAllClient,
  updateClient,
  getAppointmentInfo,
  updateAppointmentInfo,
  updatePersonalHistory,
  updateObservation,
  deleteObservation,
  updateMedicalHistory,
  updateDietHistory,
  createFileDetail,
  updateFileDetail,
  deleteFileDetail,
  getAllFileDetail,
};
