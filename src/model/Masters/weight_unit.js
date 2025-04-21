const mongoose = require('mongoose')
const base_schema = require('./base_schema');

const weightunitschema = new mongoose.Schema(base_schema.obj)

const weightunit = mongoose.model('weightunit', weightunitschema);
module.exports = weightunit;

