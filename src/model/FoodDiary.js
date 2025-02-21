const mongoose = require('mongoose');

const mealScheduleSchema = new mongoose.Schema({
  mealType: {
    type: String,
  },
  time: {
    type: String,
  },
  meal: {
    type: [String], 
    default: [], 
  },
  notes: {
    type: String,
    default: "",
  },
});

const foodDiaryDataSchema = new mongoose.Schema({
  registrationDate: {
    type: Date,
    required: true,
  },
  mealSchedule: [mealScheduleSchema]
});

const foodDiary = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  clientId: {
    type: String,
    //type: mongoose.Schema.Types.ObjectId,
    required: true,
    //ref: 'Clients',
  },
  foodDiaryData: [foodDiaryDataSchema],
});

module.exports = mongoose.model('FoodDiarys', foodDiary);
