const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const TemplateFilterSchema = new mongoose.Schema(base_schema.obj)

const template_filter = mongoose.model('template_filter', TemplateFilterSchema);
module.exports = template_filter;