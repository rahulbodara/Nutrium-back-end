const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const LanguageSchema = new mongoose.Schema(base_schema.obj)

const language = mongoose.model('language', LanguageSchema);
module.exports = language;