const mongoose = require('mongoose');

const ClientSidePhysicalActivitySchema = new mongoose.Schema(
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
        date: {
            type: Date,
            default: Date.now()
        },
        physicalActivity: [{
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
            },
        }]
    })



module.exports = mongoose.model('ClientSidePhysicalActivity', ClientSidePhysicalActivitySchema);