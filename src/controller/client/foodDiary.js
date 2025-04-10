const FoodDiary = require("../../model/FoodDiary");
const mealTemplate = require("../../model/mealTemplate");
const mongoose = require("mongoose");
const Food = require("../../model/Food");
const moment = require("moment/moment");
const Activity = require("../../model/Activitys");

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
    if (!clientId || !registrationDate || !mealType || !time || !foodId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields (clientId, registrationDate, mealType, time, foodId)",
      });
    }

    const formattedDate = moment(registrationDate).format("YYYY-MM-DD");
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        error: "Food not found",
      });
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
      photourl: req.file?.path || "",
      comments,
      foodIndex: new mongoose.Types.ObjectId(),
    };

    mealItem.meal.push(pushData);

    let foodDiary = await FoodDiary.findOne({ clientId });

    const dateEntry = foodDiary.foodDiaryData.find(entry =>
      moment(entry.registrationDate).format("YYYY-MM-DD") === formattedDate
    );

    let updatedDiary;

    if (dateEntry) {
      updatedDiary = await FoodDiary.findOneAndUpdate(
        {
          _id: foodDiary._id,
          "foodDiaryData.registrationDate": dateEntry.registrationDate,
        },
        {
          $push: { "foodDiaryData.$.mealSchedule": mealItem },
        },
        { new: true }
      );
    } else {
      const newDateEntry = {
        registrationDate,
        mealSchedule: [mealItem],
      };

      updatedDiary = await FoodDiary.findOneAndUpdate(
        { _id: foodDiary._id },
        {
          $push: { foodDiaryData: newDateEntry },
        },
        { new: true }
      );
    }

    await Activity.create({
      clientId,
      action: "Added meal to diary",
      details: {
        registrationDate,
        mealType,
        foodName: food.displayName,
        foodId: food._id,
        time,
      },
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Meal added to food diary successfully",
      foodDiary: updatedDiary,
    });

  } catch (error) {
    console.error("Error in addMealInDiary:", error);
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

    if (!clientId || !registrationDate || !scheduleId) {
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
