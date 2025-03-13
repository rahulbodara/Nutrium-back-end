const FoodDiary = require("../../model/FoodDiary");
const mealTemplate = require("../../model/mealTemplate");
const mongoose = require("mongoose");
const Food = require("../../model/Food");

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
    const { registrationDate, mealType, time, foodId, comments } = req.body;

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

    const pushData = {
      displayName: food.displayName,
      foodId: food._id,
      photourl: "",
      comments,
      foodIndex: new mongoose.Types.ObjectId(),
    };

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

const updateTimeAndCommentInDiary = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { registrationDate, scheduleId, time, comments, foodIndex } = req.body;

    const foodDiary = await FoodDiary.findOne({ clientId });

    if (!foodDiary) {
      return res.status(404).json({
        success: false,
        error: "Food diary not found",
      });
    }

    const updateFields = {};
    const arrayFilters = [
      { 'entry.registrationDate': new Date(registrationDate) },
      { 'meal._id': scheduleId }
    ];

    if (time) {
      updateFields['foodDiaryData.$[entry].mealSchedule.$[meal].time'] = time;
    }

    if (comments) {
      updateFields['foodDiaryData.$[entry].mealSchedule.$[meal].meal.$[food].comments'] = comments;
      arrayFilters.push({ 'food.foodIndex': foodIndex });
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const updatedUser = await FoodDiary.findOneAndUpdate(
      { clientId },
      { $set: updateFields },
      {
        arrayFilters,
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "Meal not found in the food diary",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      foodDiary: updatedUser,
    });

  } catch (error) {
    console.error("Error updating meal in food diary:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const deleteFoodFromDiary = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { registrationDate, scheduleId, foodIndex } = req.body;

    if (!clientId || !registrationDate || !scheduleId || !foodIndex) {
      return res.status(400).json({
        success: false,
        error: "clientId, registrationDate, scheduleId, and foodIndex are required",
      });
    }

    const foodDiary = await FoodDiary.findOne({ clientId });

    if (!foodDiary) {
      return res.status(404).json({
        success: false,
        error: "Food diary not found",
      });
    }

    const updatedFoodDiary = await FoodDiary.findOneAndUpdate(
      {
        _id: foodDiary._id,
      },
      {
        $pull: {
          "foodDiaryData.$[entry].mealSchedule.$[meal].meal": {
            foodIndex: new mongoose.Types.ObjectId(foodIndex),
          },
        },
      },
      {
        arrayFilters: [
          { "entry.registrationDate": new Date(registrationDate) },
          { "meal._id": new mongoose.Types.ObjectId(scheduleId) },
        ],
        new: true,
      }
    );

    if (!updatedFoodDiary) {
      return res.status(404).json({
        success: false,
        error: "Food not found in the diary",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
      foodDiary: updatedFoodDiary,
    });
  } catch (error) {
    console.error("Error deleting food from diary:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const deleteMealScheduleInFoodDiary = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { registrationDate, scheduleId } = req.body;
   
    if (!clientId || !registrationDate || !scheduleId ) {
      return res.status(400).json({
        success: false,
        error: "clientId, registrationDate and scheduleId are required",
      });
    }

    const foodDiary = await FoodDiary.findOne({ clientId });

    if (!foodDiary) {
      return res.status(404).json({
        success: false,
        error: "Food diary not found",
      });
    }

    const updatedFoodDiary = await FoodDiary.findOneAndUpdate(
      {
        _id: foodDiary._id,
        "foodDiaryData.registrationDate": registrationDate,
      },
      {
        $pull: {
          "foodDiaryData.$.mealSchedule": {
            _id: new mongoose.Types.ObjectId(scheduleId),
          },
        },
      },
      {
        new: true,
      }
    );

    if (!updatedFoodDiary) {
      return res.status(404).json({
        success: false,
        error: "Food not found in the diary",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
      foodDiary: updatedFoodDiary,
    });
  } catch (error) {
    console.error("Error deleting food from diary:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  fetchFoodDiary,
  addMealInDiary,
  updateTimeAndCommentInDiary,
  deleteFoodFromDiary,
  deleteMealScheduleInFoodDiary
};
