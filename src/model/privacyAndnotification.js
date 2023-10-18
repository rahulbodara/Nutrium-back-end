const mongoose = require('mongoose');

const privacyandnotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    privacy:{

        termsofuse:{
            type: String,
            enum:["I accept the Terms and Conditions","I do not accept the Terms and Conditions"]
        },
        privacypolicy:{
            type: String,
            enum:["I accept the Privacy Policy","I do not accept the Privacy Policy"]
        },
    },
    notifications:{
        marketingcommunications:{
            type: String,
            enum:["I want to receive all communications","I want to receive personalised follow-up","I don't want to receive communications"]
        },
        browsernotifications: {
            type: String,
            enum:["I want to receive notifications","I do not want to receive notifications"]
        },
        emailswithdailyhighlights: {
            type: String,
            enum:["I want to get emails with daily highlights","I don't want to get emails with daily highlights"]
        },
        emailswithmymonthlystatistics: {
            type: String,
            enum:["I want to get emails with my monthly statistics","I don't want to get emails with my monthly statistics"]
        },
    }
});

module.exports = new mongoose.model('privacyandnotification', privacyandnotificationSchema);