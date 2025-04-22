const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const AppointmentReq = new mongoose.Schema(base_schema.obj)

const appointment_req = mongoose.model('appointment_req', AppointmentReq);
module.exports = appointment_req;