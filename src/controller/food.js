const Food = require('../model/Food');

const addFood = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      name,
      source,
      group,
      quantity,
      macronutrients,
      micronutrients,
      commonMeasures,
    } = req.body;
    const newFood = await Food.create({
      userId,
      name,
      source,
      group,
      quantity,
      macronutrients,
      micronutrients,
      commonMeasures,
    });

    return res.status(200).json({
      success: true,
      message: 'Food created successfully',
      newFood,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllFood = async (req, res, next) => {
  try {
    const foods = await Food.find();

    return res.status(200).json({
      success: true,
      foods,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getFoodById = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;
    const userId = req.userId;

    const food = await Food.find({ _id: foodId, userId: userId });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    return res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getFoodsByUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const foods = await Food.find({ userId });

    return res.status(200).json({
      success: true,
      foods,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteFood = async (req, res, next) => {
  try {
    const userId = req.userId;
    const foodId = req.params.foodId;
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    if (food.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this food',
      });
    }

    await Food.findByIdAndDelete(foodId);

    return res.status(200).json({
      success: true,
      message: 'Food deleted successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateFood = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;
    const userId = req.userId;
    const updateData = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found',
      });
    }

    if (food.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this food',
      });
    }

    const updatedFood = await Food.findByIdAndUpdate(foodId, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Food updated successfully',
      updatedFood,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  addFood,
  getAllFood,
  getFoodById,
  getFoodsByUser,
  deleteFood,
  updateFood,
};
