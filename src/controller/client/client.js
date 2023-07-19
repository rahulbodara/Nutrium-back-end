const Client = require('../../model/Client');
const fs = require('fs');
const mongoose = require('mongoose');
const AppointmentInformation = require('../../model/AppointmentInformation');

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
        message: 'This email already exists',
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
      message: 'client added successfully',
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
    const query = {
      _id: req.params.id,
      userId: req.userId,
      isActive: 1,
    };
    const client = await Client.findOne(query);
    if (!client) {
      return res.status(404).json({ message: 'client Not Found!' });
    }
    res.status(200).json(client);
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

    // Check if the client exists in the database
    const existingAppointmentInfo = await AppointmentInformation.findOne({
      clientId: clientId,
    });

    if (existingAppointmentInfo) {
      // If the client exists, update the existing document
      const updatedAppointmentInfo =
        await AppointmentInformation.findByIdAndUpdate(
          existingAppointmentInfo._id,
          {
            userId: userId,
            appointmentReason,
            expectations,
            clinicGoals,
            otherInfo,
          },
          { new: true }
        );

      return res.status(200).json({
        success: true,
        message: 'Appointment Information updated successfully',
        appointment: updatedAppointmentInfo,
      });
    } else {
      // If the client does not exist, create a new document
      const newAppointmentInfo = new AppointmentInformation({
        userId: userId,
        clientId: clientId,
        appointmentReason,
        expectations,
        clinicGoals,
        otherInfo,
      });

      const savedAppointmentInfo = await newAppointmentInfo.save();

      return res.status(201).json({
        success: true,
        message: 'New Appointment Information created',
        appointment: savedAppointmentInfo,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updatePersonalHistory = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const { personalhistory } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { pesonalhistory: personalhistory },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Client personal history updated successfully',
      client: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

const updateObservation = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const { observationDetail } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { observationDetail: observationDetail },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Client Observation updated successfully',
      client: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

const deleteObservation = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const observationId = req.params.observationId;

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        $pull: {
          observationDetail: { _id: observationId },
        },
      },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Observation deleted successfully',
      client: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

const updateMedicalHistory = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const { medicalHistory } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { medicalHistory: medicalHistory },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Medical History updated successfully',
      client: updatedClient,
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
  updateAppointmentInfo,
  updatePersonalHistory,
  updateObservation,
  deleteObservation,
  updateMedicalHistory,
};
