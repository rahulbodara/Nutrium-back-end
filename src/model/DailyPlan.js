const mongoose = require('mongoose');

const dailyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Clients',
  },
  mealId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Mealplan',
  },
  name: String,
  note: String,
  categories: [
    {
      name: String,
      subcategories: [
        {
          name: String,
        },
      ],
    },
  ],
},{timestamps:true},);

module.exports = mongoose.model('DailyPlan', dailyPlanSchema);
