const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const deducemeasurements = new mongoose.Schema(base_schema.obj)

const deduce_measurement = mongoose.model('deduce_measurement', deducemeasurements);
module.exports = deduce_measurement;