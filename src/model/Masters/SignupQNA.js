const mongoose = require('mongoose');

const SignupQNASchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    }
})

const SignupQNA = mongoose.model('SignupQNA', SignupQNASchema);
module.exports = SignupQNA;