const mongoose = require('mongoose')
const base_schema = require('./base_schema');

const Unitchema = new mongoose.Schema(base_schema.obj)

const unit = mongoose.model('unit', Unitchema);
module.exports = unit;