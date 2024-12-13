// const mongoose = require('mongoose');

// const mealSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: [
//       'Breakfast',
//       'Brunch',
//       'Morning snack',
//       'Lunch',
//       'Afternoon Snack',
//       'Pre-workout snack',
//       'Post-workout snack',
//       'Dinner',
//       'Supper',
//     ],
//     required: true,
//   },
//   time: { type: String, required: true }, // e.g., "08:00 AM"
//   foodItems: [
//     { type: mongoose.Schema.Types.ObjectId, ref: 'Food' } 
//   ],
// });

// const dayPlanSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   day: {
//     type: String,
//     enum: [
//       'Monday',
//       'Tuesday',
//       'Wednesday',
//       'Thursday',
//       'Friday',
//       'Saturday',
//       'Sunday',
//     ],
//     required: true,
//     unique: true,
//   },
//   meals: {
//     type: [mealSchema], 
//     validate: {
//       validator: function (meals) {
//         return meals.length === 9; 
//       },
//       message: 'Each day plan must have exactly 9 meal types.',
//     },
//   },
// });

// const MealPlan = mongoose.model('MealPlan', dayPlanSchema);

// module.exports = { Food, MealPlan };


//************************************************Testing*********************************************************/




// const mongoose = require('mongoose');

// // Meal Schema
// const mealSchema = new mongoose.Schema({
//   mealType: { type: String, required: true },
//   time: { type: String, required: true },
//   foodItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }]  // Assuming food items are separate documents in the FoodItem collection
// });

// // Meal Plan Schema
// const mealPlanSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   meals: [
//     {
//       day: { type: String, required: true },
//       meals: [mealSchema]  // Array of meals for a specific day
//     }
//   ]
// });

// // Helper function to ensure that all days of the week are covered
// mealPlanSchema.methods.ensureAllDaysCovered = function () {
//   // Define all days of the week
//   const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
//   // Create an array of existing days in the current meal plan
//   const currentDays = this.meals.map(meal => meal.day);

//   // Loop through all days of the week and check if they're already covered
//   allDays.forEach(day => {
//     if (!currentDays.includes(day)) {
//       // If a day is missing, add it with default meals
//       this.meals.push({
//         day,
//         meals: [
//           {
//             mealType: 'Breakfast',
//             time: '08:00 AM',
//             foodItems: []  // You can add default food items or leave it empty
//           },
//           {
//             mealType: 'Lunch',
//             time: '12:30 PM',
//             foodItems: []  // You can add default food items or leave it empty
//           },
//           {
//             mealType: 'Dinner',
//             time: '07:00 PM',
//             foodItems: []  // You can add default food items or leave it empty
//           }
//         ]
//       });
//     }
//   });

//   // After ensuring all days are covered, save the changes
//   return this.save();
// };

// // Helper function to remove a day dynamically
// mealPlanSchema.methods.removeDay = function (dayToRemove) {
//   // Define all days of the week
//   const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//   // Ensure the day to remove is valid and isn't the only day left
//   if (allDays.includes(dayToRemove)) {
//     // Remove the day from the meals array
//     this.meals = this.meals.filter(meal => meal.day !== dayToRemove);
    
//     // After removal, ensure all days are still covered
//     return this.ensureAllDaysCovered();
//   } else {
//     return Promise.reject(new Error('Invalid day to remove'));
//   }
// };

// // Helper function to add a new day dynamically
// mealPlanSchema.methods.addDay = function (newDay) {
//   // Define all days of the week
//   const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//   // Ensure the day to add is valid and isn't already in the meal plan
//   if (allDays.includes(newDay) && !this.meals.some(meal => meal.day === newDay)) {
//     // Add the new day with default meals
//     this.meals.push({
//       day: newDay,
//       meals: [
//         {
//           mealType: 'Breakfast',
//           time: '08:00 AM',
//           foodItems: []  // You can add default food items or leave it empty
//         },
//         {
//           mealType: 'Lunch',
//           time: '12:30 PM',
//           foodItems: []  // You can add default food items or leave it empty
//         },
//         {
//           mealType: 'Dinner',
//           time: '07:00 PM',
//           foodItems: []  // You can add default food items or leave it empty
//         }
//       ]
//     });

//     // After adding the new day, ensure all days are still covered
//     return this.ensureAllDaysCovered();
//   } else {
//     return Promise.reject(new Error('Invalid day to add or day already exists'));
//   }
// };

// // Meal Plan Model
// const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

// module.exports = MealPlan;




//--------------------------testing 2--------------------------------------------------------------------------------------------------------------------------------


// const mongoose = require('mongoose');


// const mealSchema = new mongoose.Schema({
//   mealType: { type: String, required: true },
//   time: { type: String, required: true },
//   foodItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }] 
// });


// const mealPlanSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   meals: [
//     {
//       day: { type: String, required: true },
//       meals: [mealSchema]  
//     }
//   ]
// });


// mealPlanSchema.methods.ensureAllDaysCovered = function () {
  
//   const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
//   const currentDays = this.meals.map(meal => meal.day);

 
//   allDays.forEach(day => {
//     if (!currentDays.includes(day)) {
//       this.meals.push({
//         day,
//         meals: [
//           {
//             mealType: 'Breakfast',
//             time: '08:00 AM',
//             foodItems: []  
//           },
//           {
//             mealType: 'Lunch',
//             time: '12:30 PM',
//             foodItems: []  
//           },
//           {
//             mealType: 'Dinner',
//             time: '07:00 PM',
//             foodItems: []  
//           }
//         ]
//       });
//     }
//   });

//   return this.save();
// };


// mealPlanSchema.methods.removeDay = function (dayToRemove) {

//   const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

 
//   if (allDays.includes(dayToRemove)) {
//     this.meals = this.meals.filter(meal => meal.day !== dayToRemove);
//     return this.ensureAllDaysCovered();
//   } else {
//     return Promise.reject(new Error('Invalid day to remove'));
//   }
// };


// mealPlanSchema.methods.addDay = function (newDay) {
 
//   const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   if (allDays.includes(newDay) && !this.meals.some(meal => meal.day === newDay)) {
//     this.meals.push({
//       day: newDay,
//       meals: [
//         {
//           mealType: 'Breakfast',
//           time: '08:00 AM',
//           foodItems: []  
//         },
//         {
//           mealType: 'Lunch',
//           time: '12:30 PM',
//           foodItems: []  
//         },
//         {
//           mealType: 'Dinner',
//           time: '07:00 PM',
//           foodItems: [] 
//         }
//       ]
//     });

//     return this.ensureAllDaysCovered();
//   } else {
//     return Promise.reject(new Error('Invalid day to add or day already exists'));
//   }
// };

// const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

// module.exports = MealPlan;





//-----------------------------------------testing 3 -----------------------------------------------------------

const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  mealType: { type: String, required: true },
  time: { type: String, required: true },
  foodItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }] 
});

const mealPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  meals: [
    {
      day: { 
        type: String, 
        required: true, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
      },
      meals: [mealSchema] 
    }
  ]
});

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

mealPlanSchema.methods.ensureAllDaysCovered = function () {
  const currentDays = this.meals.map(meal => meal.day);

  allDays.forEach(day => {
    if (!currentDays.includes(day)) {
      this.meals.push({
        day,
        meals: [
          { mealType: 'Breakfast', time: '08:00 AM', foodItems: [] },
          { mealType: 'Lunch', time: '12:30 PM', foodItems: [] },
          { mealType: 'Dinner', time: '07:00 PM', foodItems: [] }
        ]
      });
    }
  });

  return this.save();
};

mealPlanSchema.pre('save', function (next) {
  if (!this.isModified('meals')) {
    return next();
  }

  this.ensureAllDaysCovered()
    .then(() => next())
    .catch(err => next(err));
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = MealPlan;
