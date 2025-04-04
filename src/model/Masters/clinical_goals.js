const mongoose = require('mongoose');
const base_schema = require('./base_schema');

const ClinicalGoalsSchema = new mongoose.Schema(base_schema.obj)

const clinical_goals = mongoose.model('clinical_goals ', ClinicalGoalsSchema);
module.exports = clinical_goals;