const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const FoodFilterSchema = new mongoose.Schema(base_schema.obj)

const food_filter = mongoose.model('food_filter', FoodFilterSchema);
module.exports = food_filter;