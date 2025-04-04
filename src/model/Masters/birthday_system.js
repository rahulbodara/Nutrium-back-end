const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const BirthdaySystemSchema = new mongoose.Schema(base_schema.obj)

const birthday_system = mongoose.model('birthday_system', BirthdaySystemSchema);
module.exports = birthday_system;