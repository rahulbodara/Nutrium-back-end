const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const PregnancyTypeSchema = new mongoose.Schema(base_schema.obj)

const pregnancy_type = mongoose.model('pregnancy_type', PregnancyTypeSchema);
module.exports = pregnancy_type;