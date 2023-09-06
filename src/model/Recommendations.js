const mongoose = require('mongoose');

const recommendation_schema = new mongoose.Schema({

    physicalActivity: [
        [
            {
                type: String,
                required: true,
            },
        ],
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
{ timestamps:true }
);

const Recommendation = mongoose.model('client_Recommendation', recommendation_schema);

module.exports = Recommendation;