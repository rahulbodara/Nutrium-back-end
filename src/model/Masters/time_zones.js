const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const TimeZonesSchema = new mongoose.Schema(base_schema.obj)

const time_zones = mongoose.model('time_zones', TimeZonesSchema);
module.exports = time_zones;