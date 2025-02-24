const FoodDiary = require('../../model/FoodDiary');

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

  module.exports = {
    fetchFoodDiary,
  };