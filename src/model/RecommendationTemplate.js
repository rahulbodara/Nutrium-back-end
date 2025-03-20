const mongoose = require('mongoose');

const RecommendationTemplateSchema = mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user',
        },
        templateName: {
            type: String,
            required: true,
        },
        recommendation: {
            type: String,
            required: true,
        }
    }
)

const RecommendationTemplate = mongoose.model('RecommendationTemplate', RecommendationTemplateSchema)
module.exports = RecommendationTemplate;
