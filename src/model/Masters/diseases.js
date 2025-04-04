const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const DiseasesSchema = new mongoose.Schema(base_schema.obj)

const diseases = mongoose.model('diseases', DiseasesSchema);
module.exports = diseases;