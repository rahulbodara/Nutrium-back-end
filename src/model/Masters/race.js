const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const RaceSchema = new mongoose.Schema(base_schema.obj)

const race = mongoose.model('race', RaceSchema);
module.exports = race;