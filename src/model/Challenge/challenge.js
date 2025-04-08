const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    respondedAt: Date,
    progress: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date
    }
}, { _id: false });

const challengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['steps', 'calories', 'loss_weight', 'gain_weight'],
        required: true
    },
    description: String,
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    targetValue: {
        type: Number,
        required: true
    },
    coinReward: {
        type: Number,
        required: true
    },
    participationLimit: Number,
    privacy: {
        type: String,
        enum: ['public', 'private'],
        required: true
    },
    selectedClients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients'
    }],
    participants: [participantSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('challenge', challengeSchema);
