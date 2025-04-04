const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const NutritionalDeficienciesSchema = new mongoose.Schema(base_schema.obj)

const nutritional_deficiencies = mongoose.model('nutritional_deficiencies', NutritionalDeficienciesSchema);
module.exports = nutritional_deficiencies;