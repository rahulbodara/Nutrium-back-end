const mongoose = require('mongoose')
const base_schema = require('./base_schema');

const lengthUnitschema = new mongoose.Schema(base_schema.obj)

const lengthUnit = mongoose.model('lengthunit', lengthUnitschema);
module.exports = lengthUnit;

