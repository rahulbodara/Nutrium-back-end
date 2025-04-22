const mongoose = require('mongoose')
const base_schema = require('./base_schema');

const staticMeasureSchema = new mongoose.Schema(base_schema.obj)

const staticMeasure = mongoose.model('staticMeasure', staticMeasureSchema);
module.exports = staticMeasure;

