const FoodDiary = require('../../model/FoodDiary');
const mealTemplate = require('../../model/mealTemplate');
const mongoose = require("mongoose");

const fetchFoodDiary = async (req, res, next) => {
  try {
      const { clientId } = req.params;

      if (!clientId) {
          return res.status(400).json({ success: false, error: "clientId is required" });
      }

      const foodDiary = await FoodDiary.findOne({ clientId});

      if (!foodDiary) {
          return res.status(404).json({ success: false, error: "Food diary not found" });
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
      const { registrationDate ,mealType ,time } = req.body;

      const mealItem = {
        mealType :"Breakfast2",
        time:"7:00 AM",
        meal:[],
        notes:"",
        _id: new mongoose.Types.ObjectId()
      }

      if (!clientId) {
          return res.status(400).json({ success: false, error: "clientId is required" });
      }

      const foodDiary = await FoodDiary.findOne({ clientId});
      
      
      if (!foodDiary) {
          return res.status(404).json({ success: false, error: "Food diary not found" });
      }

      const today = new Date();
      const isoDate = today.toISOString();

        const result = await FoodDiary.findOneAndUpdate(
          { 
              _id: foodDiary._id,
              "foodDiaryData.registrationDate": registrationDate,
          },
          { 
              $push: { "foodDiaryData.$.mealSchedule": mealItem }
          },
          { 
              new: true 
          }
      );

      console.log("foodDiary",foodDiary);
      return res.status(200).json({
          success: true,
          message: "Food diary fetched successfully",
          foodDiary :result,
      });
  } catch (error) {
      console.error("Error fetching food diary:", error);
      return next(error);
  }
};

  module.exports = {
    fetchFoodDiary,
    addMealInDiary
  };