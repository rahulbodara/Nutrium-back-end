const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const ClientFilterSchema = new mongoose.Schema(base_schema.obj)

const client_filter = mongoose.model('client_filter ', ClientFilterSchema);
module.exports = client_filter;