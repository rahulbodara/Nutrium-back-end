const mongoose = require('mongoose')
const base_schema = require('./base_schema');

const volumeunitschema = new mongoose.Schema(base_schema.obj)

const volumeunit = mongoose.model('volumeunit', volumeunitschema);
module.exports = volumeunit;

