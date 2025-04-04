const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const RecipeCategorySchema = new mongoose.Schema(base_schema.obj)

const recipe_category = mongoose.model('recipe_category', RecipeCategorySchema)
module.exports = recipe_category;