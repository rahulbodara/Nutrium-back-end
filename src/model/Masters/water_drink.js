const mongoose = require('mongoose')
const base_schema = require('./base_schema');

const weaterDink = new mongoose.Schema(base_schema.obj)

const water_drink = mongoose.model('water_drink', weaterDink);
module.exports = water_drink;

