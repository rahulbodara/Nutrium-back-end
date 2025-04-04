const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const SleepQualitySchema = new mongoose.Schema(base_schema.obj)

const sleep_quality = mongoose.model('sleep_quality', SleepQualitySchema);
module.exports = sleep_quality;
