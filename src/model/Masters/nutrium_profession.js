const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const NutriumProfessionSchema = new mongoose.Schema(base_schema.obj)

const nutrium_profession = mongoose.model('nutrium_profession', NutriumProfessionSchema);
module.exports = nutrium_profession;

