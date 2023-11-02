const mongoose = require('mongoose');

const physicalActivitySchema = new mongoose.Schema({
    time: {
        type: Number
    },
    timeunit: {
        type: String,
    },
    durations: {
        type: String,
    },
    activities: {
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
})

module.exports = mongoose.model('physicalActivity', physicalActivitySchema);