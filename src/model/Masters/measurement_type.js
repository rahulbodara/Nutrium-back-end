const mongoose = require('mongoose');

const base_schema = require('./base_schema');
const MeasurementSchema = new mongoose.Schema(base_schema.obj)

const measurement_type = mongoose.model('measurement_type', MeasurementSchema);

module.exports = measurement_type;
