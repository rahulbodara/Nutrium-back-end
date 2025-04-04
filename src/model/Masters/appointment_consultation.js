const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const AppointmentConsultationSchema = new mongoose.Schema(base_schema.obj)

const appointment_consultation = mongoose.model('appointment_consultation', AppointmentConsultationSchema)
module.exports = appointment_consultation;