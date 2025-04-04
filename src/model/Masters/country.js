const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const CountrySchema = new mongoose.Schema(base_schema.obj)

const country = mongoose.model('country', CountrySchema);
module.exports = country;