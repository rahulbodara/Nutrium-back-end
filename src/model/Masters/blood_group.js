const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const BloodGroupSchema = new mongoose.Schema(base_schema.obj)

const blood_group = mongoose.model('blood_group', BloodGroupSchema);
module.exports = blood_group;    