const mongoose = require('mongoose');
const validator = require('validator');

const clientSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    fullName: {
      type: String,
      required: [true, 'Please enter your name'],
      maxLength: [30, 'Name cannot exceed 30 charaters'],
      minLength: [4, 'Name should have more then 4 charaters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    gender: {
      type: String,
      required: [true, 'Please select a gender'],
      enum: ['Male', 'Female', 'Others'],
    },
    workplace: {
      type: String,
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Please enter a date of birth'],
      validate: {
        validator: function (value) {
          const dateRegex =
            /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
          if (!dateRegex.test(value)) {
            return false;
          }
          const parts = value.split('/');
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          const date = new Date(year, month - 1, day);
          return (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          );
        },
        message: 'Please enter a valid date of birth (DD/MM/YYYY)',
      },
    },

    image: {
      type: String,
    },
    occupation: {
      type: String,
    },
    tags: {
      type: String,
    },
    country: {
      type: String,
      required: [true, 'Please select a country'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Please enter a Mobile Number'],
    },
    address: {
      type: String,
    },
    zipcode: {
      type: Number,
    },
    processNumber: {
      type: Number,
    },
    nationalNumber: {
      type: Number,
    },
    healthNumber: {
      type: Number,
    },
    vatNumber: {
      type: Number,
    },
    isActive: {
      type: Number,
      default: 1,
    },
    appointmentInformation: [
      {
        appointmentReason: {
          type: String,
        },
        expectations: {
          type: String,
        },
        clinicGoals: [
          {
            type: String,
          },
        ],
        otherInfo: {
          type: String,
        },
      },
    ],
    pesonalhistory: [
      {
        bowelMovements: {
          type: String,
          enum: ['Normal', 'Constipation', 'Diarrhea', 'Irregular'],
        },
        bowelMovementsInfo: {
          type: String,
        },
        sleepQuality: {
          type: String,
        },
        sleepQualityInfo: {
          type: String,
        },
        smoker: {
          type: String,
        },
        smokerInfo: {
          type: String,
        },
        alcoholConsumption: {
          type: String,
        },
        alcoholConsumptionInfo: {
          type: String,
        },
        maritalStatus: {
          type: String,
        },
        maritalStatusInfo: {
          type: String,
        },
        physicalActivity: {
          type: String,
        },
        race: {
          type: String,
          enum: ['Caucasian', 'Black', 'Asian'],
        },
        otherInfo: {
          type: String,
        },
      },
    ],
    observationDetail: [
      {
        registrationDate: {
          type: String,
          required: function () {
            return this.observationDetail && this.observationDetail.length > 0;
          },
          validate: {
            validator: function (value) {
              const dateRegex =
                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
              if (!dateRegex.test(value)) {
                return false;
              }
              const parts = value.split('/');
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10);
              const year = parseInt(parts[2], 10);
              const date = new Date(year, month - 1, day);
              return (
                date.getDate() === day &&
                date.getMonth() === month - 1 &&
                date.getFullYear() === year
              );
            },
            message: 'Please enter a valid date in the format DD/MM/YYYY',
          },
        },
        observation: {
          type: String,
        },
      },
    ],
    diseasesDetail: [
      {
        diseases: {
          type: String,
        },
        diseasesInfo: [
          {
            type: String,
          },
        ],
        medication: {
          type: String,
        },
        pesonalhistory: {
          type: String,
        },
        familyHistory: {
          type: String,
        },
        otherInfo: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Clients', clientSchema);
