const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const FileCategorySchema = new mongoose.Schema(base_schema.obj)

const file_category = mongoose.model('file_category', FileCategorySchema);
module.exports = file_category;