const mongoose = require('mongoose');

const measurementPreference = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    deducemeasurement:{
        type: String,
        enum:["Deduce fat mass, lean body mass and percentages","Only deduce percentages","Don't deduce measurements"]
    },
    anthropometricmeasurements:[String],
    analyticaldata:[String],
    bodycompotion:[String]
});

module.exports = mongoose.model('MeasurementPreference', measurementPreference);