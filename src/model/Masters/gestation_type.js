const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const GestationTypeSchema = new mongoose.Schema(base_schema.obj)

const gestation_type = mongoose.model('gestation_type', GestationTypeSchema)
module.exports = gestation_type;
