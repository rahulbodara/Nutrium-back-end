const DailyPlan = require('../model/DailyPlan');
const MealPlan = require('../model/Mealplan');

// const createMealPlan = async (req, res, next) => {
//   try {
//     const userId = req.userId;
//     const { days, creationMethod, associatePlanning, copyMealsPlan } = req.body;

//     // Create a new Mealplan instance with the provided data
//     const newMealPlanData = {
//       userId: userId,
//       days,
//       creationMethod,
//       associatePlanning,
//       copyMealsPlan,
//     };

//     // Check the creationMethod to determine how to handle the daily plans
//     if (creationMethod === 'Merge selected days into a single version') {
//       // Merge selected days into a single daily plan
//       const selectedDays = days.map((dayData) => dayData.day);
//       const unselectedDays = [
//         'Monday',
//         'Tuesday',
//         'Wednesday',
//         'Thursday',
//         'Friday',
//         'Saturday',
//         'Sunday',
//       ].filter((day) => !selectedDays.includes(day));

//       const dailyPlanDataMerged = {
//         selectedDays,
//         userId: userId,
//         breakfast: '',
//         morningSnack: '',
//         lunch: '',
//       };

//       const createdDailyPlanMerged = await DailyPlan.create(
//         dailyPlanDataMerged
//       );

//       // Store the dailyPlan ObjectId in the Mealplan model
//       newMealPlanData.days = createdDailyPlanMerged._id;

//       // Create another DailyPlan for unselected days
//       const dailyPlanDataUnselected = {
//         selectedDays: unselectedDays,
//         userId: userId,
//         breakfast: '',
//         morningSnack: '',
//         lunch: '',
//       };
//       const createdDailyPlanUnselected = await DailyPlan.create(
//         dailyPlanDataUnselected
//       );

//       // Store the ObjectId of the second DailyPlan in the associatePlanning array of the Mealplan model
//       newMealPlanData.associatePlanning = [
//         { planning: createdDailyPlanUnselected._id },
//       ];
//     } else if (creationMethod === 'Create a verion for each day') {
//       // Create separate daily plans for each selected day
//       for (const dayData of days) {
//         const dailyPlanDataSingle = {
//           selectedDays: [dayData.day],
//           userId: userId,
//           breakfast: '',
//           morningSnack: '',
//           lunch: '',
//         };
//         const createdDailyPlanSingle = await DailyPlan.create(
//           dailyPlanDataSingle
//         );
//         dayData.dailyPlan = createdDailyPlanSingle._id; // Associate the DailyPlan with the Mealplan
//       }
//     } else {
//       throw new Error('Invalid creationMethod provided.');
//     }

//     // Create the Meal Plan in the database using the Mealplan model
//     const createdMealPlan = await Mealplan.create(newMealPlanData);
//     return res.status(201).json({
//       success: true,
//       message: 'Meal Plan created successfully!!!',
//       mealPlan: createdMealPlan,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// createMealPlan
const createMealPlan = async (req, res, next) => {
  try {
    const mealPlanData = req.body;
    const clientId = req.params.clientId;

    if (mealPlanData.days && mealPlanData.days.length > 0) {
      // Check if all days are selected
      const allDaysSelected = mealPlanData.days.length === 7;

      if (mealPlanData.creationMethod === 'Merge selected days into a single version') {
        // Remove any days that are part of the new plan from the existing plans
        for (const day of mealPlanData.days) {
          await MealPlan.updateOne(
            { clientId, days: { $in: [day] } },
            { $pull: { days: day } }
          );
        }

        // Create or update the meal plan for the selected days
        await MealPlan.updateOne(
          { clientId, days: mealPlanData.days },
          { $set: { ...mealPlanData, clientId } },
          { upsert: true }
        );

        // Get the current list of days for this client
        const existingPlan = await MealPlan.findOne({ clientId });
        const currentDays = existingPlan ? existingPlan.days : [];

        // Calculate the remaining days
        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const remainingDays = allDays.filter(day => !currentDays.includes(day));

        // Create or update the meal plan for the remaining days
        await MealPlan.updateOne(
          { clientId, days: { $in: remainingDays } },
          { $set: { ...mealPlanData, clientId, days: remainingDays } },
          { upsert: true }
        );

        res.status(201).json({ data: mealPlanData, message: 'Meal plan created or updated successfully' });
      } else if (mealPlanData.creationMethod === 'Create a version for each day') {
        // Create or update separate meal plans for each selected day
        const createdMealPlans = [];
        for (const day of mealPlanData.days) {
          await MealPlan.updateOne(
            { clientId, days: [day] },
            { $set: { ...mealPlanData, clientId, days: [day] } },
            { upsert: true }
          );
          createdMealPlans.push(day);
        }

        // Create or update the meal plan for the remaining days
        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const remainingDays = allDays.filter(day => !mealPlanData.days.includes(day));

        await MealPlan.updateOne(
          { clientId, days: { $in: remainingDays } },
          { $set: { ...mealPlanData, clientId, days: remainingDays } },
          { upsert: true }
        );

        res.status(201).json({ data: createdMealPlans, message: 'Meal plan created or updated successfully' });
      } else {
        res.status(400).json({ error: 'Invalid creationMethod' });
      }
    } else {
      // If no specific "days" are provided, add the meal plan to 'Every Day' by default
      mealPlanData.days = ['Every Day'];
      mealPlanData.clientId = clientId;

      // Create or update the "Every Day" meal plan
      await MealPlan.updateOne(
        { clientId, days: ['Every Day'] },
        { $set: { ...mealPlanData, clientId } },
        { upsert: true }
      );

      res.status(201).json({ data: mealPlanData, message: 'Meal plan created or updated successfully' });
    }
  } catch (error) {
      next(error);
      }
};

//get meal plan

const getMealPlan = async(req,res,next) => {
  try{
    clientId = req.params.clientId;
    const mealPlan = await MealPlan.find({clientId: clientId});
    if(mealPlan.length === 0){
      return res.status(404).json({message: 'Meal plan not found'});
    }
    return res.status(200).json({message:"Meal plan retrieved successfully",mealPlan});
  }
  catch(error){
    next(error);
  }
}


module.exports = { 
  createMealPlan,
  getMealPlan
};
