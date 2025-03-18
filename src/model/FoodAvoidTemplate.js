const mongoose = require('mongoose');

const FoodAvoidTemplateSchema = mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user',
        },
        tamplateName: {
            type: String,
            required: true,
        },
        foodsToAvoid: {
            type: [String],
            required: true,
        }
    }
)

const FoodAvoidTemplate = mongoose.model('FoodAvoidTemplate', FoodAvoidTemplateSchema)
module.exports = FoodAvoidTemplate;
