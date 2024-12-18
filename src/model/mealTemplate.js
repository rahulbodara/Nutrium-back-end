const mongoose = require('mongoose');

const mealBaseSchema = new mongoose.Schema({
  time: { 
    type: String, 
    required: true, 
    default: '07:00 AM' 
  },
  foodItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food', default: [] }],
  Notes: { type: String }
});

const createMealSchema = (mealType, defaultTime) => {
  return new mongoose.Schema({
    ...mealBaseSchema.obj,
    mealType: { type: String, default: mealType },
    time: { type: String, default: defaultTime }
  });
};
const createMealWithFoodItems = (mealType, defaultTime) => {
  return new mongoose.Schema({
    time: { type: String, required: true, default: defaultTime },
    Appetizer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
    Dish: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
    Dessert: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
    Beverage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
    Notes: { type: String },
    mealType: { type: String, default: mealType }
  });
};

const breakfastSchema = createMealSchema('Breakfast', '07:00 AM');
const brunchSchema = createMealSchema('Brunch', '10:00 AM');
const morningSnackSchema = createMealSchema('Morning snack', '10:00 AM');
const afternoonSnackSchema = createMealSchema('Afternoon snack', '4:00 PM');
const preWorkoutSnackSchema = createMealSchema('PreWorkoutSnack', '6:00 PM');
const postWorkoutSnackSchema = createMealSchema('PostWorkoutSnack', '7:00 PM');
const supperSchema = createMealSchema('Supper', '10:00 PM');

const lunchSchema = createMealWithFoodItems('Lunch', '12:00 PM');
const dinnerSchema = createMealWithFoodItems('Dinner', '7:00 PM');

const daysMealSchema = new mongoose.Schema({
  day: { 
    type: [String],  
  },
  meals: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Breakfast' },
    { type: mongoose.Schema.Types.ObjectId, ref: 'MorningSnack' },
    { type: mongoose.Schema.Types.ObjectId, ref: 'Lunch' },
    { type: mongoose.Schema.Types.ObjectId, ref: 'AfternoonSnack' },
    { type: mongoose.Schema.Types.ObjectId, ref: 'Dinner' },
    { type: mongoose.Schema.Types.ObjectId, ref: 'Supper' }
  ]
});

const mealPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mealSchedule:  { type: [daysMealSchema], default: [] }
});

const Breakfast = mongoose.model('Breakfast', breakfastSchema);
const Brunch = mongoose.model('Brunch', brunchSchema);
const MorningSnack = mongoose.model('MorningSnack', morningSnackSchema);
const Lunch = mongoose.model('Lunch', lunchSchema);
const AfternoonSnack = mongoose.model('AfternoonSnack', afternoonSnackSchema);
const PreWorkoutSnack = mongoose.model('PreWorkoutSnack', preWorkoutSnackSchema);
const PostWorkoutSnack = mongoose.model('PostWorkoutSnack', postWorkoutSnackSchema);
const Dinner = mongoose.model('Dinner', dinnerSchema);
const Supper = mongoose.model('Supper', supperSchema);
const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
const DaysMeal = mongoose.model('DayMeal', daysMealSchema);

module.exports = {
  MealPlan,
  DaysMeal,
  Breakfast,
  Brunch,
  MorningSnack,
  Lunch,
  AfternoonSnack,
  PreWorkoutSnack,
  PostWorkoutSnack,
  Dinner,
  Supper
};
