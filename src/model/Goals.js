const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Clients',
    },
    goals: [
      {
        goalType: {
          type: String,
          required: true,
          enum: [
            'Generic (Sports and food routines, among others)',
            'Measured (Anthropometric data, Analytical Data, Body Composition)',
            ],
        },
        measurements:[
          {
            measurementtype : {
              type: String,
            },
            entries:[
              {
                value:{
                  type: String,
                },
                unit:{
                  type: String,
                },
                description:{
                  type: String,
                },
                deadline:{
                  type: String,
                }
              }
            ]
          }
        ],
        description: {
          type: String,
        },
        deadline: {
          type: String,
        },
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goals', goalsSchema);
