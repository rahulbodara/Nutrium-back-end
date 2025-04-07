const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    message: {
        type: String,
    },
    roomId: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    },
    tempId: {
        type: String,
        // required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);