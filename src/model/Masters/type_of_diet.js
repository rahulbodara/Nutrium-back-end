const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const TypeOFDietSchema = new mongoose.Schema(base_schema.obj)

const type_of_diet = mongoose.model('type_of_diet', TypeOFDietSchema);
module.exports = type_of_diet;    