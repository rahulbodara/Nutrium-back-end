const mongoose = require('mongoose');

const foodDiary = new mongoose.Schema({
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
  registrationDate: {
    type: Date,
    required: true,
  },
  mealSchedule: [
    {
      mealType: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      meal:{
        type: String,
      },
      photo:{
        type: String,
      },
      comments:{
        type: String,
      },
    },
  ],
  observation: {
    type: String,
  },
});

module.exports = mongoose.model('FoodDiaries', foodDiary);
