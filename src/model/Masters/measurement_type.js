const mongoose = require('mongoose');

const MeasurementTypeSchema = new mongoose.Schema({
    text: { type: String, required: true }
});

MeasurementTypeSchema.virtual('unit', {
    ref: 'unit',
    localField: '_id',
    foreignField: 'MeasurementType'
});

MeasurementTypeSchema.set('toObject', { virtuals: true });
MeasurementTypeSchema.set('toJSON', { virtuals: true });

const measurement_type = mongoose.model('measurement_type', MeasurementTypeSchema);
module.exports = measurement_type;
