const FoodDiary = require("../../model/FoodDiary");
const mealTemplate = require("../../model/mealTemplate");
const mongoose = require("mongoose");
const Food = require('../../model/Food');

const fetchFoodDiary = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res
        .status(400)
        .json({ success: false, error: "clientId is required" });
    }

    const foodDiary = await FoodDiary.findOne({ clientId });

    if (!foodDiary) {
      return res
        .status(404)
        .json({ success: false, error: "Food diary not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Food diary fetched successfully",
      foodDiary,
    });
  } catch (error) {
    console.error("Error fetching food diary:", error);
    return next(error);
  }
};

const addMealInDiary = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { registrationDate, mealType, time, foodId } = req.body;

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, error: "Food not found" });
    }

    const mealItem = {
      mealType,
      time,
      meal: [],
      notes: "",
      _id: new mongoose.Types.ObjectId(),
    };

    const pushData ={
        displayName: food.displayName,
        foodId: food._id,
        photourl:"",
        foodIndex: new mongoose.Types.ObjectId(),
      }

      if (req.file && req.file.path) {
        pushData.photourl = req.file.path;
      }

    mealItem.meal.push(pushData);



    if (!clientId) {
      return res
        .status(400)
        .json({ success: false, error: "clientId is required" });
    }

    const foodDiary = await FoodDiary.findOne({ clientId });

    if (!foodDiary) {
      return res
        .status(404)
        .json({ success: false, error: "Food diary not found" });
    }

    const today = new Date();
    const isoDate = today.toISOString();

    const result = await FoodDiary.findOneAndUpdate(
      {
        _id: foodDiary._id,
        "foodDiaryData.registrationDate": registrationDate,
      },
      {
        $push: { "foodDiaryData.$.mealSchedule": mealItem },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Food diary fetched successfully",
      foodDiary: result,
    });
  } catch (error) {
    console.error("Error fetching food diary:", error);
    return next(error);
  }
};

module.exports = {
  fetchFoodDiary,
  addMealInDiary,
};
