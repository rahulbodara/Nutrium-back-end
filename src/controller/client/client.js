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
const path = require('path');
const { log } = require('mojito-cli/lib/log');

// const registerClient = async (req, res, next) => {
//   try {
//     const userId = req.userId;
//     const {
//       fullName,
//       gender,
//       workplace,
//       dateOfBirth,
//       phoneNumber,
//       email,
//       occupation,
//       country,
//       zipcode,
//     } = req.body;

//     const exist = await Client.findOne({ email, userId: { $ne: userId } });

//     if (exist) {
//       return res.status(400).json({
//         success: false,
//         message: 'This email already exists',
//       });
//     }
//     const client = await Client.create({
//       userId,
//       fullName,
//       gender,
//       workplace,
//       dateOfBirth,
//       phoneNumber,
//       email,
//       occupation,
//       country,
//       zipcode,
//     });

//     // await getScheduleAppointmentInfo(client._id);

//     return res.status(200).json({
//       success: true,
//       message: 'Client added successfully',
//       client,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

const registerClient = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientsData = req.body;

    const emails = clientsData.map(client => client.email);

    const existingClients = await Client.find({ email: { $in: emails }, userId });

    const emailsNotInExistingClients = emails.filter(email => !existingClients.some(client => client.email === email));
    console.log(emailsNotInExistingClients);

    const addedClients = [];
    const updatedClients = [];
    const invalidEmails = [];
    const importedHistory = [];
    let importHistoryCreated = false;


    for (const clientData of clientsData) {
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
        isImported,
      } = clientData;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        invalidEmails.push(email);
        continue;
      }
      if (isImported === true) {


        await Client.updateMany({ email, userId, isImported: true }, {
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
          isImported,
        },
          { upsert: true });


        const updatedData = await Client.find({ email, userId });
        updatedClients.push(...updatedData);
        console.log('updateddata-->>',updatedClients);
        const dataEmails = updatedData.map(item => item.email);
        console.log(dataEmails);

        if (!importHistoryCreated) {
          const { status, importedIn, clients, new_client, updated, success } = req.body;
          const totalClientsAdded = clientsData.length;
          let countClients;
          console.log('emailsNotInExistingClients-->>',emailsNotInExistingClients);
          const emails = emailsNotInExistingClients.include(dataEmails);
          console.log('emails: ', emails);
          if (emails.length > 0) {
           countClients = emails.length;
           console.log('countClients: ', countClients);
          }
          else
          {
            countClients = 0;
          }
          
          const successPercentage = ((countClients + existingClients.length) / totalClientsAdded) * 100;
          console.log('successPercentage-->>', successPercentage);



          const History = new importHistory({
            status,
            importedIn,
            clients: totalClientsAdded,
            new_client: countClients,
            updated: existingClients.length,
            success: `${successPercentage}%`
          });
          console.log('History-->>', History);

          // await History.save();
          importedHistory.push(History);

          importHistoryCreated = true;
        }

      } else {
        const exist = await Client.find({ email, userId });
        const existEmails = exist.map(client => client.email);

        if (exist.length > 0) {
          return res.status(400).json({
            success: false,
            message: `${existEmails.join(', ')} email already exists`,
          });
        } else {
          // Create a new client
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
            address,
            tags,
            processNumber,
            nationalNumber,
            healthNumber,
            vatNumber,
            isImported,
          });
          addedClients.push(client);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Clients processed successfully',
      addedClients,
      updatedClients,
      invalidEmails,
      importedHistory
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

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
    const {
      typeOfRecord,
      gestationType,
      lastMenstrualPeriod,
      beginningOfLactation,
      observations,
      clientId,
      durationOfLactationInMonths,
    } = req.body;

    const userId = req.userId;

    const lmpDate = new Date(lastMenstrualPeriod);
    const currentDate = new Date();

    const gestationalAgeInWeeks =
      (currentDate - lmpDate) / (1000 * 60 * 60 * 24 * 7);

    let currentPregnancyTrimester = null;
    let currentPregnancyWeek = null;
    let lactating = null;
    let status = null;

    if (typeOfRecord === 'Pregnancy and lactation') {
      if (!lastMenstrualPeriod || !beginningOfLactation || !durationOfLactationInMonths) {
        return res.status(400).send({ message: 'lastMenstrualPeriod,beginningOfLactation,durationOfLactationInMonths are required fields.' });
      }
      let trimester;
      let lactationMonthsRemaining = null

      if (gestationalAgeInWeeks <= 13) {
        trimester = 'First Trimester 1';
      } else if (gestationalAgeInWeeks <= 26) {
        trimester = 'Second Trimester 2';
      } else {
        trimester = 'Third Trimester 3';
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
            console.log('lactationMonthsRemaining -->>', lactationMonthsRemaining);

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
        trimester = 'First Trimester 1';
      } else if (gestationalAgeInWeeks <= 26) {
        trimester = 'Second Trimester 2';
      } else {
        trimester = 'Third Trimester 3';
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
        return res.status(400).json({ message: 'beginningOfLactation,durationOfLactationInMonths are required' });
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

          console.log('remainingDays -->>', remainingDays);

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


    const newPregnancyHistory = new pregnancyHistory({
      userId: userId,
      clientId,
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
    });

    const data = await newPregnancyHistory.save();

    return res.status(200).json({
      success: true,
      message: 'Pregnancy History added successfully',
      data: data,
    });
  } catch (error) {
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
    const {
      typeOfRecord,
      gestationType,
      lastMenstrualPeriod,
      beginningOfLactation,
      observations,
      durationOfLactationInMonths,
    } = req.body;


    const lmpDate = new Date(lastMenstrualPeriod);
    const currentDate = new Date();

    const gestationalAgeInWeeks =
      (currentDate - lmpDate) / (1000 * 60 * 60 * 24 * 7);

    let currentPregnancyTrimester = null;
    let currentPregnancyWeek = null;
    let lactating = null;
    let status = null;

    if (typeOfRecord === 'Pregnancy and lactation') {
      if (!lastMenstrualPeriod || !beginningOfLactation || !durationOfLactationInMonths) {
        return res.status(400).send({ message: 'lastMenstrualPeriod,beginningOfLactation,durationOfLactationInMonths are required fields.' });
      }
      let trimester;
      let lactationMonthsRemaining = null

      if (gestationalAgeInWeeks <= 13) {
        trimester = 'First Trimester 1';
      } else if (gestationalAgeInWeeks <= 26) {
        trimester = 'Second Trimester 2';
      } else {
        trimester = 'Third Trimester 3';
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
        trimester = 'First Trimester 1';
      } else if (gestationalAgeInWeeks <= 26) {
        trimester = 'Second Trimester 2';
      } else {
        trimester = 'Third Trimester 3';
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

          console.log('remainingDays -->>', remainingDays);

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
    const file = req.file.path;
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
    const { goalType, description, deadline, measurementType, value, unit } =
      req.body;

    const newGoalData = {
      userId: userId,
      clientId: clientId,
      goalType,
      description,
      deadline,
      measurementType,
      value,
      unit,
    };

    const createGoal = await Goals.create(newGoalData);

    return res.status(201).json({
      success: true,
      message: 'Goal created successfully!!!',
      EatingBehaviour: createGoal,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    const userId = req.userId;
    const clientId = req.body.clientId;
    const goalId = req.params.goalId;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(clientId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid userId or clientId' });
    }

    const deletedGoal = await Goals.findOneAndDelete({
      _id: goalId,
      userId: userId,
      clientId: clientId,
    });

    if (!deletedGoal) {
      return res.status(404).json({
        success: false,
        message: 'Food Diaries not found!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Goal deleted successfully!!!',
    });
  } catch (error) {
    next(error);
  }
};

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

    const goals = await Goals.find({
      clientId: clientId,
      measurementType: measurementType,
    });

    if (goals.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goals not found for the client',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Goals retrieved successfully',
      goals: goals,
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

    const goals = await Goals.find({ clientId: clientId });

    if (goals.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'Goals not found for the client',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Goals retrieved successfully',
      goals: goals,
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
      measurementsDate,
      measurements,
    } = req.body;

    const existingMeasurement = await Measurements.findOne({
      userId: userId,
      clientId: clientId,
      measurementsDate: measurementsDate,
    });

    if (existingMeasurement) {
      existingMeasurement.measurements = measurements;
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
        measurementsDate,
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
    console.log(measurement);
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
    const clientId = req.body.clientId;
    const measurementId = req.params.measurementId;
    const measurementType = req.body.measurementType;
    const measurementTypeId = req.body.measurementTypeId;
    const newDate = req.body.newDate;
    const newValue = req.body.newValue;
    const newUnit = req.body.newUnit;

    // Find the measurement data for the specified client
    const measurement = await Measurements.findOne({
      _id: measurementId,
      clientId: clientId,
    });

    if (!measurement) {
      return res
        .status(404)
        .json({ error: 'Measurement data not found for the client' });
    }

    // Find the array corresponding to the specified measurementType (e.g., weight, height)
    const measurementArray = measurement[measurementType];

    if (!measurementArray) {
      return res.status(404).json({ error: 'Measurement type not found' });
    }

    // Find the index of the measurement object with the specified _id
    const indexToUpdate = measurementArray.findIndex(
      (item) => item._id.toString() === measurementTypeId
    );

    if (indexToUpdate === -1) {
      return res.status(404).json({ error: 'Measurement data not found' });
    }

    // Update the value for the measurement object with the specified _id
    measurementArray[indexToUpdate].date = newDate;
    measurementArray[indexToUpdate].value = newValue;
    measurementArray[indexToUpdate].unit = newUnit;

    // Save the updated measurement object
    await measurement.save();

    return res
      .status(200)
      .json({ message: 'Measurement data updated successfully' });
  } catch (error) {
    next(error);
  }
};

const getWeight = async (req, res, next) => {
  try {
    const clientId = req.body.clientId;
    const clientWeight = await Measurements.find({ clientId: clientId });

    const goals = await Goals.find({ clientId: clientId, measurementType: 'Weight' }, { value: 1, unit: 1, deadline: 1 })
      .sort({ deadline: 1 });

    if (!goals) {
      return res.status(404).json({ message: 'weight not found' });
    }


    let lastWeight = null;
    let goalWeight = null;
    let lastHeight = null;

    if (clientWeight.length > 0) {
      const weightData = clientWeight.map((measurement) => ({
        weight: measurement.weight,
      }));

      const heightData = clientWeight.map((measurement) => ({
        height: measurement.height,
      }));

      const weight = weightData[0]?.weight;
      const height = heightData[0]?.height;

      if (weight && weight.length > 0) {
        lastWeight = weight[weight.length - 1];
      }

      if (height && height.length > 0) {
        lastHeight = height[height.length - 1];
      }
    }

    if (goals.length > 0) {
      goalWeight = goals[0];

      for (const goal of goals) {
        if (lastWeight && goal.deadline === lastWeight.date) {
          goalWeight = goal;
          break;
        }
      }
    }
    else {
      return res.status(404).json({ message: 'weight not found' });
    }

    const heightInMeters = lastHeight ? lastHeight.value / 100 : null;

    const bmiLastWeight = lastWeight ? lastWeight.value / (heightInMeters * heightInMeters) : null;
    const heightInInches = lastHeight ? lastHeight.value / 2.54 : null;
    const idealWeight = lastHeight ? 52 + 1.9 * (heightInInches - 60) : null;
    const bmiIdealWeight = lastHeight ? idealWeight / (heightInMeters * heightInMeters) : null;


    const bmi = await Measurements.findOneAndUpdate(
      { clientId: clientId },
      {
        Reference_value: idealWeight,
        bmiLastWeight: bmiLastWeight,
        bmiIdealWeight: bmiIdealWeight,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      weight: lastWeight,
      goalWeight: goalWeight,
      height: lastHeight,
      Reference_value: idealWeight,
      bmiLastWeight: bmiLastWeight,
      bmiGoalWeight: clientWeight[0]?.bmiGoalWeight || null,
      bmiIdealWeight: bmiIdealWeight,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


const updateBmi = async (req, res, next) => {
  try {
    const { clientId, Reference_value, bmiLastWeight, bmiGoalWeight, bmiIdealWeight } = req.body;
    const bmi = await Measurements.findOneAndUpdate(
      { clientId: clientId },
      {
        Reference_value,
        bmiLastWeight,
        bmiGoalWeight,
        bmiIdealWeight,
      },
      { new: true }
    );

    if (!bmi) {
      return res.status(404).json({ message: 'BMI not found' });
    }

    return res.status(200).json({
      success: true,
      bmi: bmi,
    });
  } catch (error) {
    next(error);
  }
}

const updateGoal = async (req, res, next) => {
  try {

    const goalId = req.params.goalId;
    const clientId = req.body.clientId;

    const goal = await Goals.findOneAndUpdate({ _id: goalId, clientId: clientId }, req.body, { new: true });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    return res.status(200).json({
      success: true,
      goal: goal,
    });

  }
  catch (error) {
    next(error);
  }
}


const getBodyFatPercentage = async (req, res, next) => {
  try {
    const clientId = req.body.clientId;
    const clientBodyFat = await Measurements.find({ clientId: clientId });

    const goals = await Goals.find({ clientId: clientId, measurementType: 'Body fat percentage' }, { value: 1, unit: 1, deadline: 1 })
      .sort({ deadline: 1 });

    let lastBodyFat = null;
    let goalBodyFat = null;

    if (clientBodyFat.length > 0) {
      const fatData = clientBodyFat.map((measurement) => ({
        bodyFatPercentage: measurement.bodyFatPercentage,
      }));

      const bodyFatPercentage = fatData[0]?.bodyFatPercentage;

      if (bodyFatPercentage && bodyFatPercentage.length > 0) {
        lastBodyFat = bodyFatPercentage[bodyFatPercentage.length - 1];
      }
    }

    if (goals.length > 0) {
      goalBodyFat = goals[0];

      for (const goal of goals) {
        if (goal.deadline === lastBodyFat.date) {
          goalBodyFat = goal;
          break;
        }
      }
    }
    else {
      return res.status(200).json({
        message: 'Body fat percentage not found',
      });
    }

    return res.status(200).json({
      success: true,
      bodyFat: lastBodyFat,
      goalBodyFat: goalBodyFat
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
  getWeight,
  getBodyFatPercentage,
  updateBmi,
  updateGoal
};
