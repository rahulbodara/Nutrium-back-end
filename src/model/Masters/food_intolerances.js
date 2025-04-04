const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const FoodIntolerancesSchema = new mongoose.Schema(base_schema.obj)

const food_intolerances = mongoose.model('food_intolerances', FoodIntolerancesSchema);
module.exports = food_intolerances;