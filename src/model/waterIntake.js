const mongoose = require('mongoose');

const waterIntakeSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Clients'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    waterIntakeLimit: {
        type: Number,
        default: 0
    },
    waterIntakeDate: {
        type: Date,
        default: new Date()
    },
    waterIntakeRecords: [
        {
            date: {
                type: Date,
            },
            time: {
                type: String,
            },
            DailyGoal: {
                type: Number,
                default: 0
            },
            waterIntakeAmount: [
                {
                    amount: {
                        type: String,
                        required: true,
                        default: "0ml"
                    },

                }
            ]
        }
    ]
});

const WaterIntake = mongoose.model('water_intake', waterIntakeSchema);
module.exports = WaterIntake;
