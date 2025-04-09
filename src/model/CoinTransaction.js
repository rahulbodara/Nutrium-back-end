
const mongoose = require('mongoose');

const coinTransactionSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients',
        required: true
    },
    coins: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['challenge_win', 'challenge_complete', 'referral', 'purchase', 'admin_reward'],
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'challenge'
    },
    referredUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CoinTransaction', coinTransactionSchema);
