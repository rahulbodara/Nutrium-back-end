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
      console.log("condition start ---------------->")
      const allDaysSelected = mealPlanData.days.length === 7;

      if (mealPlanData.creationMethod === 'Merge selected days into a single version') {
        for (const day of mealPlanData.days) {
          await MealPlan.updateOne(
            { clientId, days: { $in: [day] } },
            { $pull: { days: day } }
          );
        }

        // Use upsert to update the existing record if found, or create a new one if not found.
        await MealPlan.updateOne(
          { clientId, days: allDaysSelected ? ['Every Day'] : mealPlanData.days },
          { $set: { ...mealPlanData, clientId } },
          { upsert: true }
        );

        const existingPlan = await MealPlan.findOne({ clientId });
        const currentDays = existingPlan ? existingPlan.days : [];

        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const remainingDays = allDays.filter(day => !currentDays.includes(day));

        const everyDayPlan = await MealPlan.findOne({ clientId, days: { $in: mealPlanData.copyMealPlan } });
        console.log("everyDayPlan---------------------->", everyDayPlan)

        if (everyDayPlan) {
          mealPlanData.foods = everyDayPlan.foods;
          mealPlanData.name = everyDayPlan.name;
          mealPlanData.notes = everyDayPlan.notes;
        }

        await MealPlan.updateOne(
          { clientId, days: { $in: remainingDays } },
          { $set: { ...mealPlanData, clientId, days: remainingDays } },
          { upsert: true }
        );

        res.status(201).json({ data: mealPlanData, message: 'Meal plan created or updated successfully' });
      } else if (mealPlanData.creationMethod === 'Create a version for each day') {
        const selectedDays = mealPlanData.days;

        const existingPlan = await MealPlan.findOne({ clientId });
        const currentDays = existingPlan ? existingPlan.days : [];

        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const remainingDays = allDays.filter(day => !selectedDays.includes(day));


          const everyDayPlan = await MealPlan.findOne({ clientId, days: mealPlanData.copyMealPlan });
          console.log("everyDayPlan---------------------->", everyDayPlan)

          if (everyDayPlan) {
            mealPlanData.foods = everyDayPlan.foods;
            mealPlanData.name = everyDayPlan.name;
            mealPlanData.notes = everyDayPlan.notes;
          }

        for (const day of selectedDays) {
          const existingPlanForDay = await MealPlan.findOne({ clientId, days: [day] });

          if (existingPlanForDay) {
            await MealPlan.updateOne(
              { clientId, days: [day] },
              { $set: { ...mealPlanData, clientId, days: [day] } }
            );
          } else {
            await MealPlan.create({ ...mealPlanData, clientId, days: [day] });
          }
        }

        await MealPlan.updateOne(
          { clientId, days: { $in: remainingDays } },
          { $set: { ...mealPlanData, clientId, days: remainingDays } },
          { upsert: true }
        );

        res.status(201).json({ data: selectedDays, message: 'Meal plan created or updated successfully' });
      } else {
        
        const selectedDays = mealPlanData.days;
        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const remainingDays = allDays.filter(day => !selectedDays.includes(day));

        // Check if copyMealPlan is specified and set to 'Copy from Every Day'
          const everyDayPlan = await MealPlan.findOne({ clientId, days: mealPlanData.copyMealPlan });
          console.log("everyDayPlan---------------------->", everyDayPlan)

          if (everyDayPlan) {
            mealPlanData.foods = everyDayPlan.foods;
            mealPlanData.name = everyDayPlan.name;
            mealPlanData.notes = everyDayPlan.notes;
          }

        for (const day of mealPlanData.days) {
          const existingPlanForDay = await MealPlan.findOne({ clientId, days: [day] });

          if (existingPlanForDay) {
            await MealPlan.updateOne(
              { clientId, days: [day] },
              { $set: { ...mealPlanData, clientId, days: [day] } }
            );
          } else {
            await MealPlan.create({ ...mealPlanData, clientId, days: [day] });
          }
        }
        await MealPlan.updateOne(
          { clientId, days: { $in: remainingDays } },
          { $set: { ...mealPlanData, clientId, days: remainingDays } },
          { upsert: true }
        );

        res.status(201).json({ data: mealPlanData, message: 'Meal plan created or updated successfully' });
      }
    } else {
      console.log("start");
      console.log(mealPlanData.copyMealPlan);

      const everyDayPlan = await MealPlan.findOne({ clientId, days: mealPlanData.copyMealPlan });

      if (everyDayPlan) {
        mealPlanData.foods = everyDayPlan.foods;
        mealPlanData.name = everyDayPlan.name;
        mealPlanData.notes = everyDayPlan.notes;
      }

      mealPlanData.days = ['Every Day'];
      mealPlanData.clientId = clientId;

      await MealPlan.updateOne(
        { clientId, days: ['Every Day'] },
        { $set: { ...mealPlanData, clientId } },
        { upsert: true }
      );

      // Update the "Every Day" plan to include the remaining days.
      const existingPlan = await MealPlan.findOne({ clientId });
      const currentDays = existingPlan ? existingPlan.days : [];
      const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const remainingDays = allDays.filter(day => !currentDays.includes(day));

      await MealPlan.updateOne(
        { clientId, days: ['Every Day'] },
        { $set: { ...mealPlanData, clientId, days: ['Every Day', ...remainingDays] } },
        { upsert: true }
      );

      res.status(201).json({ data: mealPlanData, message: 'Meal plan created or updated successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createMealPlan };



//get meal plan

const getMealPlan = async (req, res, next) => {
  try {
    clientId = req.params.clientId;
    const mealPlan = await MealPlan.find({ clientId: clientId });
    if (mealPlan.length === 0) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    return res.status(200).json({ message: "Meal plan retrieved successfully", mealPlan });
  }
  catch (error) {
    next(error);
  }
}

//update meal plan

const updateMealPlan = async (req, res, next) => {
  try {
    const mealId = req.params.mealId;

    const mealPlan = await MealPlan.findOneAndUpdate(
      { _id:mealId },
      req.body,
      { new: true }
    );
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    return res.status(200).json({ message: "Meal plan updated successfully", mealPlan });
  }
  catch (error) {
    next(error);
  }
}


module.exports = {
  createMealPlan,
  getMealPlan,
  updateMealPlan
};
