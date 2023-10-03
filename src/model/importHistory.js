const mongoose = require('mongoose');

const importHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    status: {
        type: String,
        default: 'completed'
    },
    importedIn: {
        type: Date,
        default: Date.now()
    },
    file: {
        type: String,   
    },
    clients: {
        type: Number,
    },
    new_client: {
        type: Number,
        default: 0
    },
    updated: {
        type: Number,
        default: 0
    },
    success: {
        type: String,
        default: "0.0%"
    },
    errors: {
        type: Number,
        default: 0
    },
    line: {
        type: Number
    },
    value: {
        type: String
    },
    associatedField: {
        type: String
    },
    typeOfError: {
        type: String
    }

});

module.exports = mongoose.model('importHistory', importHistorySchema);