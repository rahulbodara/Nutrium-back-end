const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const SmokerSchema = new mongoose.Schema(base_schema.obj)

const smoker = mongoose.model('smoker', SmokerSchema);
module.exports = smoker;