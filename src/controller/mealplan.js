const DailyPlan = require('../model/DailyPlan');
const Mealplan = require('../model/Mealplan');

const createMealPlan = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { days, creationMethod, associatePlanning, copyMealsPlan } = req.body;

    // Create a new Mealplan instance with the provided data
    const newMealPlanData = {
      userId: userId,
      days,
      creationMethod,
      associatePlanning,
      copyMealsPlan,
    };

    // Check the creationMethod to determine how to handle the daily plans
    if (creationMethod === 'Merge selected days into a single version') {
      // Merge selected days into a single daily plan
      const selectedDays = days.map((dayData) => dayData.day);
      const unselectedDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ].filter((day) => !selectedDays.includes(day));

      const dailyPlanDataMerged = {
        selectedDays,
        userId: userId,
        breakfast: '',
        morningSnack: '',
        lunch: '',
      };

      const createdDailyPlanMerged = await DailyPlan.create(
        dailyPlanDataMerged
      );

      // Store the dailyPlan ObjectId in the Mealplan model
      newMealPlanData.days = createdDailyPlanMerged._id;

      // Create another DailyPlan for unselected days
      const dailyPlanDataUnselected = {
        selectedDays: unselectedDays,
        userId: userId,
        breakfast: '',
        morningSnack: '',
        lunch: '',
      };
      const createdDailyPlanUnselected = await DailyPlan.create(
        dailyPlanDataUnselected
      );

      // Store the ObjectId of the second DailyPlan in the associatePlanning array of the Mealplan model
      newMealPlanData.associatePlanning = [
        { planning: createdDailyPlanUnselected._id },
      ];
    } else if (creationMethod === 'Create a verion for each day') {
      // Create separate daily plans for each selected day
      for (const dayData of days) {
        const dailyPlanDataSingle = {
          selectedDays: [dayData.day],
          userId: userId,
          breakfast: '',
          morningSnack: '',
          lunch: '',
        };
        const createdDailyPlanSingle = await DailyPlan.create(
          dailyPlanDataSingle
        );
        dayData.dailyPlan = createdDailyPlanSingle._id; // Associate the DailyPlan with the Mealplan
      }
    } else {
      throw new Error('Invalid creationMethod provided.');
    }

    // Create the Meal Plan in the database using the Mealplan model
    const createdMealPlan = await Mealplan.create(newMealPlanData);
    return res.status(201).json({
      success: true,
      message: 'Meal Plan created successfully!!!',
      mealPlan: createdMealPlan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMealPlan };
