const mongoose = require('mongoose');

const mealBaseSchema = new mongoose.Schema({
  time: { 
    type: String, 
    required: true,
    default: '07:00 AM' 
  },
  foodItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' ,default: [] }],
  Notes: { type: String }
});


const breakfastSchema = new mongoose.Schema({
  ...mealBaseSchema.obj,
  mealType: { type: String, default: 'Breakfast' },
  time: { type: String, default: '07:00 AM' } 
});


const brunchSchema = new mongoose.Schema({
  ...mealBaseSchema.obj,
  mealType: { type: String, default: 'Brunch' },
  time: { type: String, default: '10:00 AM' } 
});


const morningSnackSchema = new mongoose.Schema({
  ...mealBaseSchema.obj,
  mealType: { type: String, default: 'Morning snack' },
  time: { type: String, default: '10:00 AM' } 
});


const lunchSchema = new mongoose.Schema({
  time: { type: String, required: true, default: '12:00 PM' }, 
  Appetizer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  Dish: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  Dessert: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  Beverage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  Notes: { type: String },
  mealType: { type: String, default: 'Lunch' }
});


const afternoonSnackSchema = new mongoose.Schema({
  ...mealBaseSchema.obj,
  mealType: { type: String, default: 'Afternoon snack' },
  time: { type: String, default: '4:00 PM' } 
});


const preWorkoutSnackSchema = new mongoose.Schema({
  ...mealBaseSchema.obj,
  mealType: { type: String, default: 'PreWorkoutSnack' },
  time: { type: String, default: '6:00 PM' } 
});


const postWorkoutSnackSchema = new mongoose.Schema({
  ...mealBaseSchema.obj,
  mealType: { type: String, default: 'PostWorkoutSnack' },
  time: { type: String, default: '7:00 PM' } 
});


const dinnerSchema = new mongoose.Schema({
  time: { type: String, required: true, default: '7:00 PM' }, 
  Appetizer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  Dish: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  Dessert: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  Beverage: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  Notes: { type: String },
  mealType: { type: String, default: 'Dinner' }
});


const supperSchema = new mongoose.Schema({
  ...mealBaseSchema.obj,
  mealType: { type: String, default: 'Supper' },
  time: { type: String, default: '10:00 PM' } 
});


const mealPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  meal: [
    {
      day: { type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      meals: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Breakfast' },
        { type: mongoose.Schema.Types.ObjectId, ref: 'MorningSnack' },
        { type: mongoose.Schema.Types.ObjectId, ref: 'Lunch' },
        { type: mongoose.Schema.Types.ObjectId, ref: 'AfternoonSnack' },
        { type: mongoose.Schema.Types.ObjectId, ref: 'Dinner' },
        { type: mongoose.Schema.Types.ObjectId, ref: 'Supper' }
      ]
    }
  ]
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

module.exports = {
  MealPlan,
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
