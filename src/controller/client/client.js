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
const Goals = require('../../model/Goals');
const Measurements = require('../../model/Measurements');
const pregnancyHistory = require('../../model/pregnancyHistory');
const importHistory = require('../../model/importHistory');

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

    // await getScheduleAppointmentInfo(client._id);

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

// const registerClient = async (req, res, next) => {
//   try {
//     const userId = req.userId;
//     const clientsData = req.body;

//     const emails = clientsData.map(client => client.email);

//     const existingClients = await Client.find({ email: { $in: emails }, userId });

//     const emailsNotInExistingClients = emails.filter(email => !existingClients.some(client => client.email === email));
//     console.log(emailsNotInExistingClients);

//     const addedClients = [];
//     const updatedClients = [];
//     const invalidEmails = [];
//     const importedHistory = [];
//     let importHistoryCreated = false;


//     for (const clientData of clientsData) {
//       const {
//         fullName,
//         gender,
//         workplace,
//         dateOfBirth,
//         phoneNumber,
//         email,
//         occupation,
//         country,
//         zipcode,
//         address,
//         tags,
//         processNumber,
//         nationalNumber,
//         healthNumber,
//         vatNumber,
//         isImported,
//       } = clientData;

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         invalidEmails.push(email);
//         continue;
//       }
//       if (isImported === true) {


//         await Client.updateMany({ email, userId, isImported: true }, {
//           fullName,
//           gender,
//           workplace,
//           dateOfBirth,
//           phoneNumber,
//           email,
//           occupation,
//           country,
//           zipcode,
//           address,
//           tags,
//           processNumber,
//           nationalNumber,
//           healthNumber,
//           vatNumber,
//           isImported,
//         },
//           { upsert: true });


//         const updatedData = await Client.find({ email, userId });
//         updatedClients.push(...updatedData);

//         if (!importHistoryCreated) {
//           const { status, importedIn, clients, new_client, updated, success } = req.body;
//           const totalClientsAdded = clientsData.length;
//           let countClients;

//           const successPercentage = ((countClients + existingClients.length) / totalClientsAdded) * 100;
//           console.log('successPercentage-->>', successPercentage);

//           const History = new importHistory({
//             status,
//             importedIn,
//             clients: totalClientsAdded,
//             new_client: countClients,
//             updated: existingClients.length,
//             success: `${successPercentage}%`
//           });
//           console.log('History-->>', History);

//           // await History.save();
//           importedHistory.push(History);

//           importHistoryCreated = true;
//         }

//       } else {
//         const exist = await Client.find({ email, userId });
//         const existEmails = exist.map(client => client.email);

//         if (exist.length > 0) {
//           return res.status(400).json({
//             success: false,
//             message: `${existEmails.join(', ')} email already exists`,
//           });
//         } else {
//           // Create a new client
//           const client = await Client.create({
//             userId,
//             fullName,
//             gender,
//             workplace,
//             dateOfBirth,
//             phoneNumber,
//             email,
//             occupation,
//             country,
//             zipcode,
//             address,
//             tags,
//             processNumber,
//             nationalNumber,
//             healthNumber,
//             vatNumber,
//             isImported,
//           });
//           addedClients.push(client);
//         }
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Clients processed successfully',
//       addedClients,
//       updatedClients,
//       invalidEmails,
//       importedHistory
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

const addImportHistory = async (req, res, next) => {

  try {
    const { status, importedIn, file, clients, new_client, updated, success, errors, line, value, associatedField, typeOfError } = req.body;
    const history = await importHistory.findByIdAndUpdate({ _id: req.params.id }, {
      status,
      importedIn,
      file,
      clients,
      new_client,
      updated,
      success,
      errors,
      line,
      value,
      associatedField,
      typeOfError
    }, { new: true }, { upsert: true });
    return res.status(200).json({
      success: true,
      message: 'Import history added successfully',
      history,
    });

  }
  catch (error) {
    console.log(error);
    next(error);
  }

}



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
        as: 'Personalandsocialhistory',
      },
    });
    aggregate.push({
      $lookup: {
        from: 'diethistories',
        localField: '_id',
        foreignField: 'clientId',
        as: 'Dietaryhistory',
      },
    });
    aggregate.push({
      $lookup: {
        from: 'medicalhistories',
        localField: '_id',
        foreignField: 'clientId',
        as: 'Medicalhistory',
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

    aggregate.push({
      $lookup: {
        from: 'eatingbehaviours',
        localField: '_id',
        foreignField: 'clientId',
        as: 'EatingBehaviours',
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
    const deletedClient = await Client.findOneAndDelete(
      { _id: clientId, isActive: 1 },
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
    const { appointmentReason, expectations, clinicGoals, clinicGoalsInfo, otherInfo } =
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
      clinicGoalsInfo,
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

// const createPregnancyHistory = async (req, res, next) => {
//   try {
//     const {
//       typeOfRecord,
//       gestationType,
//       lastMenstrualPeriod,
//       beginningOfLactation,
//       observations,
//       clientId,
//       durationOfLactationInMonths,
//     } = req.body;

//     const userId = req.userId;

//     const lmpDate = new Date(lastMenstrualPeriod);
//     const currentDate = new Date();

//     const gestationalAgeInWeeks =
//       (currentDate - lmpDate) / (1000 * 60 * 60 * 24 * 7);

//     let trimester;
//     let currentPregnancyTrimester = null;
//     let currentPregnancyWeek = null;

//     if (gestationalAgeInWeeks <= 13) {
//       trimester = 'First Trimester';
//     } else if (gestationalAgeInWeeks <= 26) {
//       trimester = 'Second Trimester';
//     } else {
//       trimester = 'Third Trimester';
//     }

//     if (gestationalAgeInWeeks < 40) {
//       currentPregnancyTrimester = trimester;
//       currentPregnancyWeek = Math.ceil(gestationalAgeInWeeks);
//     } else if (
//       beginningOfLactation &&
//       new Date(beginningOfLactation) > lmpDate
//     ) {
//       currentPregnancyTrimester = null;
//       currentPregnancyWeek = null;
//     }

//     let lactationMonthsRemaining = null;
//     let lactationDaysRemaining = null;

//     if (gestationalAgeInWeeks >= 40) {
//       if (beginningOfLactation) {
//         const lactationStartDate = new Date(beginningOfLactation);
//         if (!isNaN(lactationStartDate.getTime())) {
//           const diffInMonths =
//             (currentDate.getFullYear() - lactationStartDate.getFullYear()) * 12 +
//             (currentDate.getMonth() - lactationStartDate.getMonth());

//           lactationMonthsRemaining =
//             durationOfLactationInMonths - diffInMonths;

//           const lastLactationMonthEndDate = new Date(
//             lactationStartDate.getFullYear(),
//             lactationStartDate.getMonth() + durationOfLactationInMonths,
//             lactationStartDate.getDate()
//           );
//           const remainingDays = Math.floor(
//             (lastLactationMonthEndDate - currentDate) / (1000 * 60 * 60 * 24)
//           );

//           if (lactationMonthsRemaining <= 0 && remainingDays < 0) {
//             lactationMonthsRemaining = null;
//             lactationDaysRemaining = null;
//           } else {
//             if (remainingDays > 0) {
//               lactationMonthsRemaining += 1;
//               lactationDaysRemaining = null;
//             }
//           }
//         }
//       }
//     }

//     let status = null;

//     if (
//       currentPregnancyTrimester == null &&
//       currentPregnancyWeek == null &&
//       lactationMonthsRemaining == null
//     ) {
//       status = 'completed';
//     }

//     const newPregnancyHistory = new pregnancyHistory({
//       userId: userId,
//       clientId,
//       typeOfRecord,
//       gestationType,
//       lastMenstrualPeriod,
//       beginningOfLactation,
//       durationOfLactationInMonths,
//       observations,
//       status
//     });

//     const data = await newPregnancyHistory.save();

//     let lactating = null;
//     if (lactationMonthsRemaining !== null) {
//       lactating = `month ${lactationMonthsRemaining}`;
//       if (lactationDaysRemaining !== null) {
//         lactating += ` day(s)`;
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Pregnancy History updated successfully',
//       data: data,
//       currentPregnancyTrimester,
//       currentPregnancyWeek,
//       lactating,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


const createPregnancyHistory = async (req, res, next) => {
  try {
    let {
      typeOfRecord,
      gestationType,
      lastMenstrualPeriod,
      beginningOfLactation,
      observations,
      clientId,
      durationOfLactationInMonths,
    } = req.body;

    const formatDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      const mm = (date.getMonth() + 1).toString().padStart(2, '0');
      const dd = date.getDate().toString().padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${mm}-${dd}-${yyyy}`;
    };

    lastMenstrualPeriod = formatDate(lastMenstrualPeriod);
    beginningOfLactation = formatDate(beginningOfLactation);


    const userId = req.userId;
    const lmpDate = new Date(lastMenstrualPeriod);
    const currentDate = new Date();

    const gestationalAgeInMilliseconds = currentDate - lmpDate;
    const gestationalAgeInWeeks = gestationalAgeInMilliseconds / (1000 * 60 * 60 * 24 * 7);

    let currentPregnancyTrimester = null;
    let currentPregnancyWeek = null;
    let lactating = null;
    let status = "";

    if (typeOfRecord === 'Pregnancy and lactation') {
      if (durationOfLactationInMonths === 0) {
        return res.status(400).send({ message: 'Please enter a value greater than or equal to 1.' });
      }
      if (!lastMenstrualPeriod || !beginningOfLactation || !durationOfLactationInMonths) {
        return res.status(400).send({ message: 'These fields are required.' });
      }
      let trimester;
      let lactationMonthsRemaining = null;

      if (gestationalAgeInWeeks <= 13) {
        trimester = ' Trimester 1';
      } else if (gestationalAgeInWeeks <= 26) {
        trimester = ' Trimester 2';
      } else {
        trimester = ' Trimester 3';
      }

      if (gestationalAgeInWeeks < 40) {
        currentPregnancyTrimester = trimester;
        currentPregnancyWeek = Math.ceil(gestationalAgeInWeeks);
      } else if (
        beginningOfLactation &&
        new Date(beginningOfLactation) > lmpDate
      ) {
        currentPregnancyTrimester = null;
        currentPregnancyWeek = null;
      }

      if (gestationalAgeInWeeks >= 40) {
        if (beginningOfLactation) {
          const lactationStartDate = new Date(beginningOfLactation);
          if (!isNaN(lactationStartDate.getTime())) {
            const diffInMonths =
              (currentDate.getFullYear() - lactationStartDate.getFullYear()) * 12 +
              (currentDate.getMonth() - lactationStartDate.getMonth());

            const lactationMonthsRemaining =
              durationOfLactationInMonths - diffInMonths;

            const lastLactationMonthEndDate = new Date(
              lactationStartDate.getFullYear(),
              lactationStartDate.getMonth() + durationOfLactationInMonths,
              lactationStartDate.getDate()
            );
            const remainingDays = Math.floor(
              (lastLactationMonthEndDate - currentDate) / (1000 * 60 * 60 * 24)
            );

            if (lactationMonthsRemaining <= 0 && remainingDays < 0) {
              lactating = null;
              status = 'completed';
            } else {
              if (remainingDays > 0) {
                const currentLactatingMonth = Math.ceil(durationOfLactationInMonths - lactationMonthsRemaining);
                lactating = `month ${currentLactatingMonth}`;
              } else {
                lactating = `month ${lactationMonthsRemaining}`;
              }
            }
          }
        }
      }
    } else if (typeOfRecord === 'Pregnancy') {
      if (!lastMenstrualPeriod) {
        return res.status(400).json({ message: 'lastMenstrualPeriod is required' });
      }
      let trimester;

      if (gestationalAgeInWeeks <= 13) {
        trimester = ' Trimester 1';
      } else if (gestationalAgeInWeeks <= 26) {
        trimester = ' Trimester 2';
      } else {
        trimester = ' Trimester 3';
      }

      if (gestationalAgeInWeeks < 40) {
        currentPregnancyTrimester = trimester;
        currentPregnancyWeek = Math.ceil(gestationalAgeInWeeks);
      }
      if (gestationalAgeInWeeks >= 40) {
        status = 'completed';
      }
    } else if (typeOfRecord === 'Lactation') {
      if (!beginningOfLactation || !durationOfLactationInMonths) {
        return res.status(400).json({ message: 'beginningOfLactation and durationOfLactationInMonths are required' });
      }
      if (beginningOfLactation) {
        const lactationStartDate = new Date(beginningOfLactation);
        if (!isNaN(lactationStartDate.getTime())) {
          const diffInMonths =
            (currentDate.getFullYear() - lactationStartDate.getFullYear()) * 12 +
            (currentDate.getMonth() - lactationStartDate.getMonth());

          const lactationMonthsRemaining =
            durationOfLactationInMonths - diffInMonths;

          const lastLactationMonthEndDate = new Date(
            lactationStartDate.getFullYear(),
            lactationStartDate.getMonth() + durationOfLactationInMonths,
            lactationStartDate.getDate()
          );
          const remainingDays = Math.floor(
            (lastLactationMonthEndDate - currentDate) / (1000 * 60 * 60 * 24)
          );

          if (lactationMonthsRemaining <= 0 && remainingDays < 0) {
            status = 'completed';
          } else {
            if (remainingDays > 0) {
              const currentLactatingMonth = Math.ceil(durationOfLactationInMonths - lactationMonthsRemaining);
              lactating = `month ${currentLactatingMonth}`;
            } else {
              lactating = `month ${lactationMonthsRemaining}`;
            }
          }
        }
      }
    }

    const lastMenstrualPeriodFormatted = formatDate(lmpDate);
    const beginningOfLactationFormatted = formatDate(new Date(beginningOfLactation));

    const newPregnancyHistory = new pregnancyHistory({
      userId: userId,
      clientId,
      typeOfRecord,
      gestationType,
      lastMenstrualPeriod: lastMenstrualPeriodFormatted,
      beginningOfLactation: beginningOfLactationFormatted,
      durationOfLactationInMonths,
      observations,
      status,
      currentPregnancyTrimester,
      currentPregnancyWeek,
      lactating,
    });

    const data = await newPregnancyHistory.save();

    const response = {
      success: true,
      message: 'Pregnancy History added successfully',
      data: {
        ...data._doc,
        lastMenstrualPeriod: lastMenstrualPeriodFormatted,
        beginningOfLactation: beginningOfLactationFormatted,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updatePregnancyHistory = async (req, res, next) => {
  try {
    const id = req.params.id;

    const pregnancy = await pregnancyHistory.findOne({ _id: id });
    if (!pregnancy) {
      return res.status(404).json({
        success: false,
        message: 'Pregnancy History not found',
      });
    }
    let {
      typeOfRecord,
      gestationType,
      lastMenstrualPeriod,
      beginningOfLactation,
      observations,
      durationOfLactationInMonths,
    } = req.body;

    const formatDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      const mm = (date.getMonth() + 1).toString().padStart(2, '0');
      const dd = date.getDate().toString().padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${mm}-${dd}-${yyyy}`;
    };

    lastMenstrualPeriod = formatDate(lastMenstrualPeriod);
    beginningOfLactation = formatDate(beginningOfLactation);

    const lmpDate = new Date(lastMenstrualPeriod);
    const currentDate = new Date();

    const gestationalAgeInMilliseconds = currentDate - lmpDate;
    const gestationalAgeInWeeks = gestationalAgeInMilliseconds / (1000 * 60 * 60 * 24 * 7);


    let currentPregnancyTrimester = null;
    let currentPregnancyWeek = null;
    let lactating = null;
    let status = "";

    if (typeOfRecord === 'Pregnancy and lactation') {
      if (!lastMenstrualPeriod || !beginningOfLactation || !durationOfLactationInMonths) {
        return res.status(400).send({ message: 'lastMenstrualPeriod,beginningOfLactation,durationOfLactationInMonths are required fields.' });
      }
      let trimester;
      let lactationMonthsRemaining = null

      if (gestationalAgeInWeeks <= 13) {
        trimester = ' Trimester 1';
      } else if (gestationalAgeInWeeks <= 26) {
        trimester = ' Trimester 2';
      } else {
        trimester = ' Trimester 3';
      }

      if (gestationalAgeInWeeks < 40) {
        currentPregnancyTrimester = trimester;
        currentPregnancyWeek = Math.ceil(gestationalAgeInWeeks);
      } else if (
        beginningOfLactation &&
        new Date(beginningOfLactation) > lmpDate
      ) {
        currentPregnancyTrimester = null;
        currentPregnancyWeek = null;
      }


      if (gestationalAgeInWeeks >= 40) {
        if (beginningOfLactation) {
          const lactationStartDate = new Date(beginningOfLactation);
          if (!isNaN(lactationStartDate.getTime())) {
            const diffInMonths =
              (currentDate.getFullYear() - lactationStartDate.getFullYear()) * 12 +
              (currentDate.getMonth() - lactationStartDate.getMonth());

            const lactationMonthsRemaining =
              durationOfLactationInMonths - diffInMonths;

            const lastLactationMonthEndDate = new Date(
              lactationStartDate.getFullYear(),
              lactationStartDate.getMonth() + durationOfLactationInMonths,
              lactationStartDate.getDate()
            );
            const remainingDays = Math.floor(
              (lastLactationMonthEndDate - currentDate) / (1000 * 60 * 60 * 24)
            );

            if (lactationMonthsRemaining <= 0 && remainingDays < 0) {
              lactating = null;
              status = 'completed';
            } else {
              if (remainingDays > 0) {
                const currentLactatingMonth = Math.ceil(durationOfLactationInMonths - lactationMonthsRemaining);
                lactating = `month ${currentLactatingMonth}`;
              } else {
                lactating = `month ${lactationMonthsRemaining}`;
              }
            }
          }
        }
      }
    } else if (typeOfRecord === 'Pregnancy') {
      if (!lastMenstrualPeriod) {
        return res.status(400).json({ message: 'lastMenstrualPeriod is required' });
      }
      let trimester;

      if (gestationalAgeInWeeks <= 13) {
        trimester = ' Trimester 1';
      } else if (gestationalAgeInWeeks <= 26) {
        trimester = ' Trimester 2';
      } else {
        trimester = ' Trimester 3';
      }

      if (gestationalAgeInWeeks < 40) {
        currentPregnancyTrimester = trimester;
        currentPregnancyWeek = Math.ceil(gestationalAgeInWeeks);
      }
      if (gestationalAgeInWeeks >= 40) {
        status = 'completed';
      }
    } else if (typeOfRecord === 'Lactation') {

      if (beginningOfLactation) {
        const lactationStartDate = new Date(beginningOfLactation);
        if (!isNaN(lactationStartDate.getTime())) {
          const diffInMonths =
            (currentDate.getFullYear() - lactationStartDate.getFullYear()) * 12 +
            (currentDate.getMonth() - lactationStartDate.getMonth());

          const lactationMonthsRemaining =
            durationOfLactationInMonths - diffInMonths;

          const lastLactationMonthEndDate = new Date(
            lactationStartDate.getFullYear(),
            lactationStartDate.getMonth() + durationOfLactationInMonths,
            lactationStartDate.getDate()
          );
          const remainingDays = Math.floor(
            (lastLactationMonthEndDate - currentDate) / (1000 * 60 * 60 * 24)
          );



          if (lactationMonthsRemaining <= 0 && remainingDays < 0) {
            status = 'completed';
          } else {
            if (remainingDays > 0) {
              const currentLactatingMonth = Math.ceil(durationOfLactationInMonths - lactationMonthsRemaining);
              lactating = `month ${currentLactatingMonth}`;
            } else {
              lactating = `month ${lactationMonthsRemaining}`;
            }
          }
        }
      }
    }


    const updatePregnancyHistory = {
      typeOfRecord,
      gestationType,
      lastMenstrualPeriod,
      beginningOfLactation,
      durationOfLactationInMonths,
      observations,
      status,
      currentPregnancyTrimester,
      currentPregnancyWeek,
      lactating,
    };

    const data = await pregnancyHistory.findByIdAndUpdate({ _id: id }, updatePregnancyHistory, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Pregnancy History updated successfully',
      data: data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


const getPregnancyHistory = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }

    const userId = req.userId;

    const pregnancyhistory = await pregnancyHistory.find({
      clientId: clientId,
      userId: userId,
    });

    if (!pregnancyhistory) {
      return res.status(404).json({
        success: false,
        message: 'No pregnancy history found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'pregnancy history retrieved successfully',
      data: pregnancyhistory,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }

}

const deletePregnancyHistory = async (req, res, next) => {

  try {
    const pregnancyId = req.params.pregnancyId;

    const pregnancyhistory = await pregnancyHistory.findOne({ _id: pregnancyId });

    if (!pregnancyhistory) {
      return res.status(404).json({
        success: false,
        message: 'No pregnancy history found',
      });
    }

    await pregnancyHistory.findByIdAndDelete({ _id: pregnancyId });

    return res.status(200).json({
      success: true,
      message: 'pregnancy history deleted successfully',
    });

  }
  catch (error) {
    next(error);
  }

}

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

const addObservation = async (req, res, next) => {
  try {
    const { clientId, registrationDate, observation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }
    const userId = req.userId;

    const newObservation = new Observations({
      userId: userId,
      registrationDate,
      observation,
      clientId
    });

    const result = await newObservation.save();

    return res.status(200).json({
      success: true,
      message: 'Observation added successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }

}

const updateObservation = async (req, res, next) => {
  try {
    const observId = req.params.id;
    const { registrationDate, observation } = req.body;

    const observ = await Observations.find({ _id: observId });
    if (!observ || observ.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'observation not found',
      });
    }
    const newObservation = {
      registrationDate,
      observation,
    };
    const updatedObservation = await Observations.findByIdAndUpdate(
      { _id: observId },
      newObservation,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Observation updated successfully',
      observation: updatedObservation,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteObservation = async (req, res, next) => {
  try {
    const observationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(observationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid observation ID',
      });
    }

    const deletedObservation = await Observations.findByIdAndDelete({
      _id: observationId,
    });

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

const getObservation = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;

    const observation = await Observations.find({ clientId: clientId });

    if (!observation || observation.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Observation not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Observation found successfully',
      observation: observation,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}


const updateMedicalHistory = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const {
      diseases,
      diseasesDetail,
      medication,
      pesonalhistory,
      familyHistory,
      otherInfo,
    } = req.body;

    const userId = req.userId;
    const newMedicalHistory = {
      userId: userId,
      diseases,
      diseasesDetail,
      medication,
      pesonalhistory,
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
    const file = req.file.filename;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'You need to choose a file',
      });
    }

    const newFile = {
      userId: userId,
      clientId: clientId,
      file: file,
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
    console.log('error-------->', error);
    next(error);
  }
};

const updateFileDetail = async (req, res, next) => {
  try {
    const userId = req.userId;
    const fileId = req.params.fileId;
    const clientId = req.body.clientId;
    const { name, description, date, category } = req.body;
    const newFile = {
      name: name,
      description: description,
      date: date,
      category: category,
    };

    if (req.file && req.file.filename) {
      newFile.file = req.file.filename;
    }

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
    const clientId = req.body.clientId;
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
    next(error);
  }
};

const getAllEatingBehaviour = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }

    const behaviours = await eatingBehaviour.find({ clientId: clientId });

    if (behaviours.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Behaviours not found for the client',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Behaviours retrieved successfully',
      behaviours: behaviours,
    });
  } catch (error) {
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
    const clientId = req.body.clientId;
    const foodId = req.params.foodId;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(clientId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid userId or clientId' });
    }

    const deletedFoodDiary = await FoodDiares.findOneAndDelete({
      _id: foodId,
      userId: userId,
      clientId: clientId,
    });

    if (!deletedFoodDiary) {
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

const updateFoodDiary = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientId = req.body.clientId;
    const foodDiaryId = req.params.foodDiaryId;

    // Get the current food diary entry
    const foodDiary = await FoodDiares.findOne({
      _id: foodDiaryId,
      userId: userId,
      clientId: clientId,
    });

    if (!foodDiary) {
      return res.status(404).json({
        success: false,
        message: 'Food diary entry not found or not authorized for update.',
      });
    }

    // Create a map of existing addMeal objects based on mealType
    const existingAddMealsMap = new Map();
    for (const existingMeal of foodDiary.addMeal) {
      existingAddMealsMap.set(existingMeal.mealType, existingMeal);
    }

    // Update only selected addMeal objects based on their mealType
    for (const newAddMeal of req.body.addMeal) {
      if (existingAddMealsMap.has(newAddMeal.mealType)) {
        // Update the value for existing addMeal object
        existingAddMealsMap.get(newAddMeal.mealType).value = newAddMeal.value;
      } else {
        // Add new addMeal object to the map if it doesn't exist
        existingAddMealsMap.set(newAddMeal.mealType, {
          mealType: newAddMeal.mealType,
          value: newAddMeal.value,
        });
      }
    }

    // Convert the map values to an array to get the updated addMeal array
    const updatedAddMeals = Array.from(existingAddMealsMap.values());

    // Update other fields if needed
    foodDiary.registrationDate = req.body.registrationDate;
    foodDiary.observation = req.body.observation;

    // Update the addMeal array with the modified values
    foodDiary.addMeal = updatedAddMeals;

    // Save the updated food diary entry
    const updatedFoodDiary = await foodDiary.save();

    return res.status(200).json({
      success: true,
      message: 'Food diary entry updated successfully!',
      EatingBehaviour: updatedFoodDiary,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFoodDiary = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }

    const foodDiaries = await FoodDiares.find({ clientId: clientId });

    if (foodDiaries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food diaries not found for the client',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Food diaries retrieved successfully',
      foodDiaries: foodDiaries,
    });
  } catch (error) {
    next(error);
  }
}

const createGoal = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientId = req.params.id;
    const { goals, description, deadline } =
      req.body;

    const existingGoal = await Goals.findOne({ userId: userId, clientId: clientId });
    if (existingGoal) {
      existingGoal.goals = goals;
      existingGoal.description = description;
      existingGoal.deadline = deadline;
      const updatedGoal = await existingGoal.save();
      return res.status(400).json({
        success: true,
        message: 'Goal updated successfully!!!',
        EatingBehaviour: updatedGoal,
      });
    }
    else {
      const newGoalData = {
        userId: userId,
        clientId: clientId,
        goals,
        description,
        deadline
      };
      const createGoal = await Goals.create(newGoalData);

      return res.status(201).json({
        success: true,
        message: 'Goal created successfully!!!',
        EatingBehaviour: createGoal,
      });
    }

  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const idToDelete = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }

    const goalsData = await Goals.findOne({
      clientId: clientId,
    });

    if (!goalsData) {
      return res.status(404).json({
        success: false,
        message: 'Goals not found for the client',
      });
    }

    goalsData.goals.forEach((goal) => {
      goal.measurements.forEach((measurement) => {
        measurement.entries = measurement.entries.filter(
          (entry) => entry._id.toString() !== idToDelete
        );
      });

      if (
        goal._id.toString() === idToDelete &&
        goal.goalType === 'Generic (Sports and food routines, among others)'
      ) {
        goalsData.goals = goalsData.goals.filter(
          (goal) => goal._id.toString() !== idToDelete
        );
      }
    });
    9
    await goalsData.save();

    return res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const updateGoal = async (req, res, next) => {

  try {

    const clientId = req.params.clientId;
    const idToUpdate = req.params.entryId;
    const newValue = req.body.value;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }
    const goalsData = await Goals.findOne({
      clientId: clientId,
    });

    if (!goalsData) {
      return res.status(404).json({
        success: false,
        message: 'Goals not found for the client',
      });
    }

    for (const goal of goalsData.goals) {
      for (const measurement of goal.measurements) {
        const entryToUpdate = measurement.entries.find(
          (entry) => entry._id.toString() === idToUpdate
        );

        if (entryToUpdate) {
          entryToUpdate.value = newValue;
          await goalsData.save();
          return res.status(200).json({
            success: true,
            message: 'Entry value updated successfully',
            data: goalsData
          });
        }
      }
    }


  } catch (error) {
    next(error);
  }


}

const getGoalByMeasurementType = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const measurementType = req.params.measurementType;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }

    const goal = await Goals.find({
      clientId: clientId,
    });

    if (goal.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goals not found for the client',
      });
    }

    const measurements = [];

    const measurement = goal.forEach((item) => {
      item.goals?.forEach((goal) => {
        goal.measurements?.forEach((measurement) => {
          if (measurement.measurementtype === measurementType) {
            measurements.push(measurement);
          }
        });
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Goals retrieved successfully',
      goals: measurements,
    });
  } catch (error) {
    next(error);
  }
}


const getAllGoals = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid client ID',
      });
    }

    const goalsData = await Goals.find({
      clientId: clientId,
    });

    if (goalsData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goals not found for the client',
      });
    }

    goalsData.forEach((userData) => {
      if (userData.goals && Array.isArray(userData.goals)) {
        userData.goals.forEach((goal) => {
          if (goal.measurements && Array.isArray(goal.measurements)) {
            goal.measurements.forEach((allMeasurement) => {
              allMeasurement.entries.sort((a, b) => {
                const datePartsA = a.deadline.split('-');
                const datePartsB = b.deadline.split('-');

                const currentDate = new Date(); // Get current date

                const dayA = parseInt(datePartsA[0]);
                const monthA = parseInt(datePartsA[1]);
                const yearA = parseInt(datePartsA[2]);

                const dayB = parseInt(datePartsB[0]);
                const monthB = parseInt(datePartsB[1]);
                const yearB = parseInt(datePartsB[2]);

                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);

                const diffA = Math.abs(dateA - currentDate);
                const diffB = Math.abs(dateB - currentDate);

                return diffA - diffB;
              });
            });
          }
        });
      }
    });


    return res.status(200).json({
      success: true,
      message: 'Goals retrieved successfully',
      allGoals: goalsData,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

const registerMeasurement = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientId = req.params.id;
    const {
      measurementsdate,
      measurements,
    } = req.body;

    const existingMeasurement = await Measurements.findOne({
      userId: userId,
      clientId: clientId,
    });

    if (existingMeasurement) {
      existingMeasurement.measurements = measurements;
      existingMeasurement.measurementsdate = measurementsdate;
      console.log(existingMeasurement);
      await existingMeasurement.save();
      return res.status(200).json({
        success: true,
        message: 'Measurement updated successfully',
        measurement: existingMeasurement,
      });
    } else {
      const newMeasurement = {
        userId: userId,
        clientId: clientId,
        measurementsdate,
        measurements,
      };
      const createdMeasurement = await Measurements.create(newMeasurement);
      return res.status(200).json({
        success: true,
        message: 'Measurement added successfully',
        measurement: createdMeasurement,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};


const addNewMeasurement = async (req, res, next) => {
  try {
    const measurementId = req.params.measurementId;
    const { measurements } = req.body;

    const existingMeasurement = await Measurements.findById(measurementId);

    if (!existingMeasurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found',
      });
    }

    const updatedMeasurement = await Measurements.findByIdAndUpdate({ _id: measurementId }, { measurements }, { new: true });

    return res.status(200).json({
      success: true,
      message: 'New measurements added to existing Measurement record',
      measurement: updatedMeasurement,
    });
  } catch (error) {
    console.log('error------------->', error);
    next(error);
  }
};

const getMeasurementById = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;

    const measurement = await Measurements.findOne({ clientId: clientId });
    if (!measurement) {
      return res.status(400).json({
        success: false,
        message: 'measurement not found',
      });
    }
    const allMeasurement = await Measurements.findOne({
      clientId: clientId,
    });

    allMeasurement.measurements.forEach((measurementType) => {
      measurementType.entries.sort((a, b) => {
        const datePartsA = a.date.split('-');
        const datePartsB = b.date.split('-');

        const dayA = parseInt(datePartsA[0]);
        const monthA = parseInt(datePartsA[1]);
        const yearA = parseInt(datePartsA[2]);

        const dayB = parseInt(datePartsB[0]);
        const monthB = parseInt(datePartsB[1]);
        const yearB = parseInt(datePartsB[2]);

        // First, compare years
        if (yearA !== yearB) {
          return yearB - yearA;
        }

        // If years are the same, compare months
        if (monthA !== monthB) {
          return monthB - monthA;
        }
        if (dayA - dayB !== 0) {
          return dayB - dayA;
        } else {
          return measurementType.entries.findIndex(e => e._id === b._id) - measurementType.entries.findIndex(e => e._id === a._id);
        }

      });
    });



    return res.status(200).json({
      success: true,
      Measurement: allMeasurement,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMeasurementObject = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const entryId = req.params.entryId;

    const measurement = await Measurements.findOne({ clientId: clientId });
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    let entryDeleted = false;

    for (const measurementEntry of measurement.measurements) {
      measurementEntry.entries = measurementEntry.entries.filter((entry) => {
        if (entry._id.toString() === entryId) {
          entryDeleted = true;
          return false;
        }
        return true;
      });
    }

    if (!entryDeleted) {
      return res.status(404).json({ message: 'Entry not found within the measurement' });
    }

    await measurement.save();

    return res.status(200).json({ message: 'Entry deleted successfully', measurement: measurement });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateMeasurementObject = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const entryId = req.params.entryId;
    const updatedData = req.body; // Assuming you send the updated data in the request body

    const measurement = await Measurements.findOne({ clientId: clientId });

    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }

    let entryUpdated = false;

    for (const measurementEntry of measurement.measurements) {
      measurementEntry.entries = measurementEntry.entries.map((entry) => {
        if (entry._id.toString() === entryId) {
          entryUpdated = true;

          return { ...entry, ...updatedData };
        }
        return entry;
      });
    }

    if (!entryUpdated) {
      return res.status(404).json({ message: 'Entry not found within the measurement' });
    }

    await measurement.save();

    return res.status(200).json({ message: 'Entry updated successfully', measurement: measurement });
  } catch (error) {
    next(error);
  }
};

const getClientInfo = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const clientWeight = await Measurements.find({ clientId: clientId });
    const goal = await Goals.find({ clientId: clientId });

    if (clientWeight.length > 0) {
      clientWeight.forEach((measurement) => {
        measurement.measurements.forEach((measurementType) => {
          measurementType.entries.sort((a, b) => {
            const datePartsA = a.date.split('-');
            const datePartsB = b.date.split('-');

            const dayA = parseInt(datePartsA[0]);
            const monthA = parseInt(datePartsA[1]) - 1;
            const yearA = parseInt(datePartsA[2]);

            const dayB = parseInt(datePartsB[0]);
            const monthB = parseInt(datePartsB[1]) - 1;
            const yearB = parseInt(datePartsB[2]);

            const dateA = new Date(yearA, monthA, dayA);
            const dateB = new Date(yearB, monthB, dayB);

            return dateB - dateA;
          });
        });
      });
    }

    const measurements = [];

    const measurement = goal.forEach((item) => {
      item.goals?.forEach((goal) => {
        goal.measurements?.forEach((measurement) => {
          if (measurement.measurementtype === 'Weight') {
            measurement.entries?.forEach((entry) => {
              measurements.push(entry)
            });
          }
        });
      });
    });


    const goalFatMeasurements = [];

    const goalFat = goal.forEach((item) => {
      item.goals?.forEach((goal) => {
        goal.measurements?.forEach((measurement) => {
          if (measurement.measurementtype === 'Body fat percentage') {
            measurement.entries?.forEach((entry) => {
              goalFatMeasurements.push(entry)
            });
          }
        });
      });
    });



    measurements.forEach((measurement) => {
      const deadlineParts = measurement.deadline.split('-');
      const year = parseInt(deadlineParts[2]);
      const month = parseInt(deadlineParts[1]) - 1; // Months are zero-based
      const day = parseInt(deadlineParts[0]);
      const deadlineDate = new Date(year, month, day);
      measurement.deadlineDate = deadlineDate;
    });

    measurements.sort((a, b) => a.deadlineDate - b.deadlineDate);



    if (!goal) {
      return res.status(404).json({ message: 'weight not found' });
    }


    let lastWeight = null;
    let goalWeight = null;
    let lastHeight = null;
    let lastBodyFat = null;
    let goalBodyFat = null;

    if (clientWeight.length > 0) {
      const weightData = clientWeight.map((measurement) => ({
        weight: measurement.measurements.filter((entry) => entry.measurementtype === 'Weight')[0]?.entries
      }));


      const heightData = clientWeight.map((measurement) => ({
        height: measurement.measurements.filter((entry) => entry.measurementtype === "Height")[0]?.entries,
      }));

      const lastBodyFatData = clientWeight.map((measurement) => ({
        BodyFat: measurement.measurements.filter((entry) => entry.measurementtype === 'Body fat percentage')[0]?.entries
      }));

      const weight = weightData[0]?.weight;
      const height = heightData[0]?.height;
      const BodyFat = lastBodyFatData[0]?.BodyFat;

      if (weight && weight.length > 0) {
        lastWeight = weight[0];
      }

      if (height && height.length > 0) {
        lastHeight = height[0];
      }

      if (BodyFat && BodyFat.length > 0) {
        lastBodyFat = BodyFat[0];
      }
    }

    if (measurements.length > 0) {
      goalWeight = measurements[0];
    }
    if (goalFatMeasurements.length > 0) {
      goalBodyFat = goalFatMeasurements[0];
    }




    else {
      return res.status(404).json({ message: 'weight or BodyFat not found' });
    }

    const heightInMeters = lastHeight ? lastHeight.value / 100 : null;

    const bmiLastWeight = lastWeight ? lastWeight.value / (heightInMeters * heightInMeters) : null;
    const heightInInches = lastHeight ? lastHeight.value / 2.54 : null;
    const idealWeight = lastHeight ? 52 + 1.9 * (heightInInches - 60) : null;
    const bmiIdealWeight = lastHeight ? idealWeight / (heightInMeters * heightInMeters) : null;
    let bmiGoalWeight = goalWeight ? goalWeight?.value / (heightInMeters * heightInMeters) : null;
    console.log("goalWeight?.value------->", goalWeight?.value)

    console.log('bmiGoalWeight--->>', bmiGoalWeight);

    if (goalWeight === null) {
      goalWeight = idealWeight;
      bmiGoalWeight = goalWeight !== null ? goalWeight / (heightInMeters * heightInMeters) : null;
    }


    let bmi = await Measurements.findOne({ clientId: clientId });
    if (!bmi) {
      return res.status(404).json({ message: 'record not found' });
    }

    if (bmi && bmi.bmiFlag === false) {
      bmi = await Measurements.findOneAndUpdate(
        { clientId: clientId },
        { bmiGoalWeight: bmiGoalWeight },
        { new: true }
      );
    }

    if (bmi && bmi.bmiFlag === false) {

      return res.status(200).json({
        success: true,
        data: {
          weight: lastWeight,
          goalWeight: goalWeight,
          goalBodyFat: goalBodyFat,
          height: lastHeight,
          bodyFat: lastBodyFat,
          Reference_value: idealWeight,
          bmiLastWeight: bmiLastWeight,
          bmiGoalWeight: bmiGoalWeight,
          bmiIdealWeight: bmiIdealWeight,
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        data: {
          weight: lastWeight,
          goalWeight: goalWeight,
          goalBodyFat: goalBodyFat,
          height: lastHeight,
          bodyFat: lastBodyFat,
          Reference_value: idealWeight,
          bmiLastWeight: bmiLastWeight,
          bmiGoalWeight: bmi ? bmi.bmiGoalWeight : null,
          bmiIdealWeight: bmiIdealWeight,
        }
      });
    }



  } catch (error) {
    console.log(error);
    next(error);
  }
};


const updateBmi = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const { bmiGoalWeight } = req.body;
    const bmi = await Measurements.findOneAndUpdate(
      { clientId: clientId },
      {
        bmiGoalWeight: bmiGoalWeight
      },
      { new: true }
    );

    if (!bmi) {
      return res.status(404).json({ message: 'BMI not found' });
    }
    bmi.bmiFlag = true;
    await bmi.save();

    return res.status(200).json({
      success: true,
      bmi: bmi,
    });
  } catch (error) {
    next(error);
  }
}




module.exports = {
  registerClient,
  addImportHistory,
  deleteClient,
  getClientByID,
  getAllClient,
  updateClient,
  getScheduleAppointmentInfo,
  updateAppointmentInfo,
  updatePersonalHistory,
  addObservation,
  updateObservation,
  deleteObservation,
  getObservation,
  createPregnancyHistory,
  getPregnancyHistory,
  updatePregnancyHistory,
  deletePregnancyHistory,
  updateMedicalHistory,
  updateDietHistory,
  createFileDetail,
  updateFileDetail,
  deleteFileDetail,
  getAllFileDetail,
  createEatingBehaviour,
  deleteEatingBehaviour,
  updateEatingBehaviour,
  getAllEatingBehaviour,
  createFoodDiary,
  deleteFoodDiary,
  updateFoodDiary,
  getAllFoodDiary,
  createGoal,
  deleteGoal,
  getGoalByMeasurementType,
  getAllGoals,
  registerMeasurement,
  addNewMeasurement,
  getMeasurementById,
  deleteMeasurementObject,
  updateMeasurementObject,
  getClientInfo,
  updateBmi,
  updateGoal
};
