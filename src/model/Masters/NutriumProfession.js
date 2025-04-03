const mongoose = require('mongoose');

const NutriumProfessionSchema = new mongoose.Schema({
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

const NutriumProfession = mongoose.model('NutriumProfession', NutriumProfessionSchema);
module.exports = NutriumProfession;