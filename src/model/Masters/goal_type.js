const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const GoalTypeSchema = new mongoose.Schema(base_schema.obj)

const goal_type = mongoose.model('goal_type', GoalTypeSchema);
module.exports = goal_type;

