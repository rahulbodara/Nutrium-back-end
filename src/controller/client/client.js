const Client = require('../../model/Client');
const fs = require('fs');
const mongoose = require('mongoose');
const AppointmentInformation = require('../../model/AppointmentInformation');
const PersonalHistory = require('../../model/PersonalHistory');
const Observations = require('../../model/Observations');
const MedicalHistory = require('../../model/MedicalHistory');
const DietHistory = require('../../model/DietHistory');
const createAppointment = require('../../model/ScheduleApointment');
const eatingBehaviour = require('../../model/eatingBehaviour');
const ClientFile = require('../../model/ClientFile');
const FoodDiares = require('../../model/FoodDiares');

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

    const exist = await Client.findOne({ email, userId: { $ne: userId } });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: 'This email already exists',
      });
    }
    const client = await Client.create({
      userId,
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

    await getScheduleAppointmentInfo(client._id);

    return res.status(200).json({
      success: true,
      message: 'Client added successfully',
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
      return res.status(404).json({ message: 'client Not Found!' });
    }
    res.status(200).json(client);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getClientByID = async (req, res, next) => {
  try {
    const clientId = req.params.id;

    const query = {
      _id: clientId,
      isActive: 1,
    };
    const client = await Client.findOne(query);
    if (!client) {
      return res.status(404).json({ message: 'Client Not Found!' });
    }

    const aggregate = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(clientId),
          isActive: 1,
        },
      },
    ];

    aggregate.push({
      $lookup: {
        from: 'appointmentinformations',
        localField: '_id',
        foreignField: 'clientId',
        as: 'appointmentInformation',
      },
    });
    aggregate.push({
      $lookup: {
        from: 'personalhistories',
        localField: '_id',
        foreignField: 'clientId',
        as: 'Personal and social history',
      },
    });
    aggregate.push({
      $lookup: {
        from: 'diethistories',
        localField: '_id',
        foreignField: 'clientId',
        as: 'Dietary history',
      },
    });
    aggregate.push({
      $lookup: {
        from: 'medicalhistories',
        localField: '_id',
        foreignField: 'clientId',
        as: 'Medical history',
      },
    });
    aggregate.push({
      $lookup: {
        from: 'observations',
        localField: '_id',
        foreignField: 'clientId',
        as: 'observations',
      },
    });
    aggregate.push({
      $lookup: {
        from: 'appointments',
        localField: '_id',
        foreignField: 'clientId',
        as: 'scheduleappointment',
      },
    });
    aggregate.push({
      $lookup: {
        from: 'clientfiles',
        localField: '_id',
        foreignField: 'clientId',
        as: 'files',
      },
    });

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
        message: 'Client not found',
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
        message: 'Client1 not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Client details updated successfully',
      client: updatedClient,
    });
  } catch (error) {
    console.log('error', error);
    next(error);
  }
};

const getScheduleAppointmentInfo = async (clientId) => {
  const videoConsultationValues = {
    without_video_call: 'Not available in this option',
    google_meet: 'Generated after saving appointment',
    zoom: 'Generated after saving appointment',
  };
  try {
    const client = await Client.findById(clientId);

    if (!client) {
      throw new Error('Client not found');
    }

    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const videoConsultation = 'without_video_call';

    let updatedVideoLink = '';

    if (videoConsultation === 'other_service') {
      updatedVideoLink = 'Add here the video call link';
    } else {
      updatedVideoLink = videoConsultationValues[videoConsultation];
    }

    const clientName = client.fullName;
    const clientWorkplace = client.workplace;

    const appointmentData = {
      clientId: client._id,
      clientName,
      start,
      status: 'not_confirmed',
      videoConsultation,
      end,
      workplace: clientWorkplace,
      schedulingNotes: 'Add scheduling notes here if needed',
      videoLink: updatedVideoLink,
    };

    const appointment = new createAppointment(appointmentData);
    const savedAppointment = await appointment.save();

    return savedAppointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
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
      res.status(200).json({ message: 'Client deleted successfully' });
    } else {
      res.status(404).json({ message: 'Client not found' });
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
        message: 'Invalid appointment ID',
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
      ? 'Appointment Information updated successfully'
      : 'New Appointment Information created';

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
        message: 'Invalid client ID',
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
      ? 'Personal History updated successfully'
      : 'New Personal History created';

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
        message: 'Invalid client ID',
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
      ? 'Observation updated successfully'
      : 'New Observation created';

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
        message: 'Invalid observation ID',
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
        message: 'Observation not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Observation deleted successfully',
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
      ? 'Medical History updated successfully'
      : 'New Medical History created';

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
      ? 'Diet History updated successfully'
      : 'New Diet History created';

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
    const fileId = req.params.fileId;
    const clientId = req.params.clientId;
    const { name, description, date, category } = req.body;
    const newFile = {
      file: req.file.filename,
      name: name,
      description: description,
      date: date,
      category: category,
    };
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(clientId) ||
      !mongoose.Types.ObjectId.isValid(fileId)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user, client, or behaviourId',
      });
    }

    const updatedFile = await ClientFile.findOneAndUpdate(
      { _id: fileId, userId: userId, clientId: clientId },
      { $set: newFile },
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
    const userId = req.userId;
    const clientId = req.params.clientId;
    const fileId = req.params.fileId;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(clientId) ||
      !mongoose.Types.ObjectId.isValid(fileId)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId or clientId or fileId',
      });
    }

    const deletedFile = await ClientFile.findOneAndDelete({
      _id: fileId,
      userId: userId,
      clientId: clientId,
    });

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

const createEatingBehaviour = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientId = req.params.id;
    const behaviourData = {
      ...req.body,
      userId: userId,
      clientId: clientId,
    };

    const createdBehaviour = await eatingBehaviour.create(behaviourData);

    return res.status(201).json({
      success: true,
      message: 'Behaviour added successfully!!!',
      EatingBehaviour: createdBehaviour,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEatingBehaviour = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientId = req.params.clientId;
    const behaviourId = req.params.behaviourId;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(clientId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid userId or clientId' });
    }

    const deletedBehaviour = await eatingBehaviour.findOneAndDelete({
      _id: behaviourId,
      userId: userId,
      clientId: clientId,
    });

    if (!deletedBehaviour) {
      return res.status(404).json({
        success: false,
        message: 'Eating Behaviour not found!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Behaviour deleted successfully!!!',
    });
  } catch (error) {
    next(error);
  }
};

const updateEatingBehaviour = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientId = req.params.clientId;
    const behaviourId = req.params.behaviourId;
    const updatedData = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(clientId) ||
      !mongoose.Types.ObjectId.isValid(behaviourId)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user, client, or behaviourId',
      });
    }

    const updatedBehaviour = await eatingBehaviour.findOneAndUpdate(
      {
        _id: behaviourId,
        userId: userId,
        clientId: clientId,
      },
      { $set: updatedData },
      { new: true }
    );
    const message = updatedBehaviour._id
      ? 'Behaviour updated successfully'
      : 'New Behaviour created';

    return res.status(200).json({
      success: true,
      message: message,
      observation: updatedBehaviour,
    });
  } catch (error) {
    console.log('error------------>', error);
    next(error);
  }
};

const createFoodDiary = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientId = req.params.id;
    const foodDiaryData = {
      ...req.body,
      userId: userId,
      clientId: clientId,
    };

    const createdFoodDiary = await FoodDiares.create(foodDiaryData);

    return res.status(201).json({
      success: true,
      message: 'createdFoodDiary added successfully!!!',
      EatingBehaviour: createdFoodDiary,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFoodDiary = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientId = req.params.clientId;
    const foodId = req.params.foodId;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(clientId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid userId or clientId' });
    }

    const deletedBehaviour = await FoodDiares.findOneAndDelete({
      _id: foodId,
      userId: userId,
      clientId: clientId,
    });

    if (!deletedBehaviour) {
      return res.status(404).json({
        success: false,
        message: 'Food Diaries not found!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Food Diaries deleted successfully!!!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerClient,
  deleteClient,
  getClientByID,
  getAllClient,
  updateClient,
  getScheduleAppointmentInfo,
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
  createEatingBehaviour,
  deleteEatingBehaviour,
  updateEatingBehaviour,
  createFoodDiary,
  deleteFoodDiary,
};
