const mongoose = require('mongoose');

const dailyPlanSchema = mongoose.Schema({
  mealPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mealplan',
    required: true,
  },
  selectedDays: [
    {
      type: String,
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model for users
    required: true,
  },
  breakfast: {
    type: String,
  },
  morningSnack: {
    type: String,
  },
  lunch: {  
    type: String,
  },
});

module.exports = mongoose.model('DailyPlan', dailyPlanSchema);
