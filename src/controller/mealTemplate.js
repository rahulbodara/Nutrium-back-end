const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const {
  MealPlan,
  DaysMeal,
  Breakfast,
  MorningSnack,
  Lunch,
  AfternoonSnack,
  Dinner,
  Supper,
} = require("../model/mealTemplate");

const createMealTemplate = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Meal plan name is required" });

    const [breakfast, morningSnack, lunch, afternoonSnack, dinner, supper] =
      await Promise.all([
        Breakfast.create({}),
        MorningSnack.create({}),
        Lunch.create({}),
        AfternoonSnack.create({}),
        Dinner.create({}),
        Supper.create({}),
      ]);
    const mealIds = [
      breakfast._id,
      morningSnack._id,
      lunch._id,
      afternoonSnack._id,
      dinner._id,
      supper._id,
    ];
    const mealPlanData = {
      day: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      meals: mealIds,
    };

    const newMealPlan = await DaysMeal.create(mealPlanData);
    const newDaysMeal = await MealPlan.create({
      name,
      mealSchedule: newMealPlan,
    });

    return res
      .status(201)
      .json({
        message: "Meal Plan created successfully",
        MealPlanTemplate: newDaysMeal,
      });
  } catch (error) {
    console.error("Error creating Meal Plan:", error);
    res.status(500).json({
      message: "An error occurred while creating the Meal Plan",
      error: error.message,
    });
  }
};


const createVersion = async (req, res) => {
  try {
    const templateId = "67628f3d1aec14f52daa8665";
    const day = ["Saturday","Wednesday","Tuesday"]; 

    const MealPlann = await MealPlan.findById(templateId).lean();
    if (!MealPlann) {
      return res.status(404).json({ message: "Meal Plan not found" });
    }

    const [breakfast, morningSnack, lunch, afternoonSnack, dinner, supper] = await Promise.all([
      Breakfast.create({}),
      MorningSnack.create({}),
      Lunch.create({}),
      AfternoonSnack.create({}),
      Dinner.create({}),
      Supper.create({}),
    ]);

    const mealIds = [
      breakfast._id,
      morningSnack._id,
      lunch._id,
      afternoonSnack._id,
      dinner._id,
      supper._id,
    ];

    const updatedMealSchedules = MealPlann.mealSchedule.map(schedule => {
      const updatedDays = schedule.day.filter(d => !day.includes(d)); 
      return {
        ...schedule,
        day: updatedDays,
      };
    });

    const newMealPlan = {
      day, 
      meals: mealIds,
    };
    const secondMealPlan = await DaysMeal.create(newMealPlan);

    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      templateId,
      { $set: { mealSchedule: [...updatedMealSchedules, secondMealPlan] } }, 
      { new: true, runValidators: true } 
    );

    return res.status(201).json({
      message: "Meal Plan created successfully",
      secondMealPlan: updatedMealPlan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, please try again." });
  }
};



const deleteMealSchedule = async (req, res) => {
  try {
    const templateId = req.body.templateId; // Example: "67628e1c28b7b6e0e1482782"
    const day = req.body.day; // Example: ["Monday", "Tuesday"]

    if (!Array.isArray(day) || day.length === 0) {
      return res.status(400).json({ message: "Invalid day array" });
    }

    // Find the MealPlan
    const MealPlann = await MealPlan.findById(templateId);
    if (!MealPlann) {
      return res.status(404).json({ message: "Meal Plan not found" });
    }

    // Find the index of the object to delete
    const deleteIndex = MealPlann.mealSchedule.findIndex(schedule =>
      JSON.stringify(schedule.day.sort()) === JSON.stringify(day.sort())
    );

    if (deleteIndex === -1) {
      return res.status(404).json({ message: "No matching day array found" });
    }

    // Get the object to delete
    const scheduleToDelete = MealPlann.mealSchedule[deleteIndex];

    // Identify neighboring schedules
    const previousSchedule = MealPlann.mealSchedule[deleteIndex - 1];
    const nextSchedule = MealPlann.mealSchedule[deleteIndex + 1];

    // Determine where to move the meals
    if (previousSchedule) {
      previousSchedule.meals.push(...scheduleToDelete.meals);
      previousSchedule.day.push(...scheduleToDelete.day);
    } else if (nextSchedule) {
      nextSchedule.meals.push(...scheduleToDelete.meals);
      nextSchedule.day.push(...scheduleToDelete.day);
    }

    // Remove the object from the mealSchedule array
    MealPlann.mealSchedule.splice(deleteIndex, 1);

    // Save the updated MealPlan
    await MealPlann.save();

    return res.status(200).json({
      message: "Meal schedule deleted successfully and meals moved to neighbor",
      updatedMealPlan: MealPlann,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, please try again." });
  }
};













































const getMealTemplate = async (req, res) => {
  try {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Meal Plan ID",
      });
    }

    const mealPlan = await MealPlan.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$meal" },
      {
        $lookup: {
          from: "breakfasts",
          localField: "meal.meals",
          foreignField: "_id",
          as: "breakfastDetails",
        },
      },
      {
        $lookup: {
          from: "morningsnacks",
          localField: "meal.meals",
          foreignField: "_id",
          as: "morningSnackDetails",
        },
      },
      {
        $lookup: {
          from: "lunches",
          localField: "meal.meals",
          foreignField: "_id",
          as: "lunchDetails",
        },
      },
      {
        $lookup: {
          from: "afternoonsnacks",
          localField: "meal.meals",
          foreignField: "_id",
          as: "afternoonSnackDetails",
        },
      },
      {
        $lookup: {
          from: "dinners",
          localField: "meal.meals",
          foreignField: "_id",
          as: "dinnerDetails",
        },
      },
      {
        $lookup: {
          from: "suppers",
          localField: "meal.meals",
          foreignField: "_id",
          as: "supperDetails",
        },
      },
      {
        $addFields: {
          "meal.allMealDetails": {
            breakfast: "$breakfastDetails",
            morningSnack: "$morningSnackDetails",
            lunch: "$lunchDetails",
            afternoonSnack: "$afternoonSnackDetails",
            dinner: "$dinnerDetails",
            supper: "$supperDetails",
          },
        },
      },
      {
        $unset: "meal.meals",
      },
      {
        $project: {
          name: 1,
          meal: 1,
        },
      },
    ]);

    if (!mealPlan) {
      return res.status(404).json({
        message: "Meal Plan not found",
      });
    }

    res.status(200).json({
      message: "Meal Plan fetched successfully",
      mealPlan,
    });
  } catch (error) {
    console.error("Error fetching Meal Plan:", error);
    res.status(500).json({
      message: "An error occurred while fetching the Meal Plan",
      error: error.message,
    });
  }
};

module.exports = {
  createMealTemplate,
  getMealTemplate,
  createVersion,
};























































































// const result = await MealPlan.aggregate([
//   { $match: { _id: new mongoose.Types.ObjectId(newMealPlan._id) } },
//   { $unwind: "$meal" },
//   {
//     $lookup: {
//       from: "breakfasts",
//       localField: "meal.meals",
//       foreignField: "_id",
//       as: "breakfastDetails",
//     },
//   },
//   {
//     $lookup: {
//       from: "morningsnacks",
//       localField: "meal.meals",
//       foreignField: "_id",
//       as: "morningSnackDetails",
//     },
//   },
//   {
//     $lookup: {
//       from: "lunches",
//       localField: "meal.meals",
//       foreignField: "_id",
//       as: "lunchDetails",
//     },
//   },
//   {
//     $lookup: {
//       from: "afternoonsnacks",
//       localField: "meal.meals",
//       foreignField: "_id",
//       as: "afternoonSnackDetails",
//     },
//   },
//   {
//     $lookup: {
//       from: "dinners",
//       localField: "meal.meals",
//       foreignField: "_id",
//       as: "dinnerDetails",
//     },
//   },
//   {
//     $lookup: {
//       from: "suppers",
//       localField: "meal.meals",
//       foreignField: "_id",
//       as: "supperDetails",
//     },
//   },
//   {
//     $addFields: {
//       "meal.allMealDetails": {
//         breakfast: "$breakfastDetails",
//         morningSnack: "$morningSnackDetails",
//         lunch: "$lunchDetails",
//         afternoonSnack: "$afternoonSnackDetails",
//         dinner: "$dinnerDetails",
//         supper: "$supperDetails",
//       },
//     },
//   },
//   {
//     $unset: "meal.meals",
//   },
//   {
//     $project: {
//       name: 1,
//       meal: 1,
//     },
//   },
// ]);




