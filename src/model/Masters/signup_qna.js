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

const signup_qna = mongoose.model('signup_qna', SignupQNASchema);
module.exports = signup_qna;