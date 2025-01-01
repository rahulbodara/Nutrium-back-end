const mongoose = require('mongoose');


const CommonMeasures = mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user',
        },
        measures: [
            {
                singularName: {
                    type: String,

                },
                pluralName: {
                    type: String,

                },
                quantity: {
                    type: Number,

                },
                totalGrams: {
                    type: Number,

                },
                ediblePortion: {
                    type: Number,

                },
            }
        ],
    }
)

const Common = mongoose.model('CommonMeasures', CommonMeasures)
module.exports = Common;
