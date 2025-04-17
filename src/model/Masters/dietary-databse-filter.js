const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const DietaryDatabaseFilterSchema = new mongoose.Schema(base_schema.obj)

const diet_databse_filter = mongoose.model('diet_databse_filter', DietaryDatabaseFilterSchema);
module.exports = diet_databse_filter;