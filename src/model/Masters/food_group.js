const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const FoodGroupSchema = new mongoose.Schema(base_schema.obj)

const food_group = mongoose.model('food_group', FoodGroupSchema);
module.exports = food_group;