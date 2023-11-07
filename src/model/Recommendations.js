const mongoose = require('mongoose');

const recommendation_schema = new mongoose.Schema({

    physicalActivity: [
        [
            {
                time: {
                    type: Number
                },
                timeunit: {
                    type: String,
                },
                durations: {
                    type: String,
                },
                activity: {
                    type: String,
                },
                met: {
                    type: String,
                },
                byactivity: {
                    type: String,
                },
                dailyaverage: {
                    type: String,
                }
            }
        ]
    ],
    foodAvoids: {
        type: [String]
    },
    waterIntake: {
        type: String
    },
    recommendation: {
        type: String
    },
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

},
    { timestamps: true }
);

const Recommendation = mongoose.model('client_Recommendation', recommendation_schema);

module.exports = Recommendation;