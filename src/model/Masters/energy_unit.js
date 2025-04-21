const mongoose = require('mongoose')
const base_schema = require('./base_schema');

const energyUnitschema = new mongoose.Schema(base_schema.obj)

const energyUnit = mongoose.model('energyUnit', energyUnitschema);
module.exports = energyUnit;

