const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const AppointmentStatusSchema = new mongoose.Schema(base_schema.obj)

const appointment_status = mongoose.model('appointment_status', AppointmentStatusSchema);
module.exports = appointment_status;