const mongoose = require('mongoose');
const base_schema = require('./base_schema');
const FoodDiarySchema = new mongoose.Schema(base_schema.obj)

const food_diary = mongoose.model('food_diary', FoodDiarySchema);
module.exports = food_diary;