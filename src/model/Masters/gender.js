const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const GenderSchema = new mongoose.Schema(base_schema.obj)

const gender = mongoose.model('gender', GenderSchema);
module.exports = gender;