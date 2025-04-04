const mongoose = require('mongoose')

const UnitSchema = new mongoose.Schema({
    MeasurementType: { type: mongoose.Schema.Types.ObjectId, ref: 'measurement_type', required: true },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: String,
        required: true,
        unique: true,
    }
})

const unit = mongoose.model('unit', UnitSchema);
module.exports = unit;