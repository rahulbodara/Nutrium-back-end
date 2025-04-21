const mongoose = require('mongoose')
const base_schema = require('./base_schema');

const distanceUnitschema = new mongoose.Schema(base_schema.obj)

const distanceUnit = mongoose.model('distanceUnit', distanceUnitschema);
module.exports = distanceUnit;

