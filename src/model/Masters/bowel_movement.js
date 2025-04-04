const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const BowelMovementSchema = new mongoose.Schema(base_schema.obj)

const bowel_movement = mongoose.model('bowel_movement', BowelMovementSchema);
module.exports = bowel_movement;