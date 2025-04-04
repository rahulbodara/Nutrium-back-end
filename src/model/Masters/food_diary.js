const mongoose = require('mongoose');

const FoodDiarySchema = new mongoose.Schema({
    option: {
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

const food_diary = mongoose.model('food_diary', FoodDiarySchema);
module.exports = food_diary;