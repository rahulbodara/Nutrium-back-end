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
    recommendation : {
        type: String
    }

});

const Recommendation = mongoose.model('Recommendation', recommendation_schema);

module.exports = Recommendation;