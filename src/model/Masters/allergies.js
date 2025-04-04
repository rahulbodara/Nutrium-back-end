const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const AllergiesSchema = new mongoose.Schema(base_schema.obj)

const allergies = mongoose.model('allergies', AllergiesSchema);
module.exports = allergies;    