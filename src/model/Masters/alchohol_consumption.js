const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const AlchoholConsumptionSchema = new mongoose.Schema(base_schema.obj)

const alchohol_consumption = mongoose.model('alchohol_consumption', AlchoholConsumptionSchema);
module.exports = alchohol_consumption;