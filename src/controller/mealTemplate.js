const {
  MealPlan,
  Breakfast,
  MorningSnack,
  Lunch,
  AfternoonSnack,
  Dinner,
  Supper,
} = require("../model/mealTemplate");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const createMealTemplate = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Meal plan name is required" });
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

    const mealPlanData = {
      name,
      meal: [
        {
          day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          meals: mealIds,
        },
      ],
    };

    const newMealPlan = await MealPlan.create(mealPlanData);

    const result = await MealPlan.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(newMealPlan._id) } },
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

    res.status(201).json({
      message: "Meal Plan created successfully",
      mealPlan: result[0], 
    });
  } catch (error) {
    console.error("Error creating Meal Plan:", error);
    res.status(500).json({
      message: "An error occurred while creating the Meal Plan",
      error: error.message,
    });
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

const createVersion = async (req, res) => {
  try {

  } catch (error) {

  }
};

module.exports = {
  createMealTemplate,
  getMealTemplate,
  createVersion
};





