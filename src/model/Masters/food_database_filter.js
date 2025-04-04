const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const FoodDatabaseFilterSchema = new mongoose.Schema(base_schema.obj)

const food_database_filter = mongoose.model('food_database_filter', FoodDatabaseFilterSchema);
module.exports = food_database_filter;