const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const MeritialStatusSchema = new mongoose.Schema(base_schema.obj)

const meritial_status = mongoose.model('meritial_status', MeritialStatusSchema);
module.exports = meritial_status;