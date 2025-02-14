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
    messageType: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);