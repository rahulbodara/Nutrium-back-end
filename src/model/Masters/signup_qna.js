const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const SignupQna = new mongoose.Schema(base_schema.obj)


const signup_qna = mongoose.model('signup_qna', SignupQna);
module.exports = signup_qna;