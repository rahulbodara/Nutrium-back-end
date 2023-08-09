const DietarySupplements = require('../model/DietarySupplements.js');

const addDietarySupplements = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      name,
      source,
      group,
      quantity,
      macronutrients,
      micronutrients,
      aminogram,
      commonMeasures,
    } = req.body;
    const newDietary = await DietarySupplements.create({
      userId,
      name,
      source,
      group,
      quantity,
      macronutrients,
      micronutrients,
      aminogram,
      commonMeasures,
    });

    return res.status(200).json({
      success: true,
      message: 'Dietary Supplements created successfully',
      newDietary,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllDietarySupplements = async (req, res, next) => {
  try {
    const dietarySupplements = await DietarySupplements.find();

    return res.status(200).json({
      success: true,
      dietarySupplements,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getDietarySupplementsById = async (req, res, next) => {
  try {
    const dietaryId = req.params.dietaryId;
    const userId = req.userId;

    const dietarySupplements = await DietarySupplements.find({
      _id: dietaryId,
      userId: userId,
    });

    if (!dietarySupplements) {
      return res.status(404).json({
        success: false,
        message: 'Dietary Supplements not found',
      });
    }

    return res.status(200).json({
      success: true,
      dietarySupplements,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getDietarySupplementsByUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const dietarySupplements = await DietarySupplements.find({ userId });

    return res.status(200).json({
      success: true,
      dietarySupplements,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateDietarySupplements = async (req, res, next) => {
  try {
    const dietaryId = req.params.dietaryId;
    const userId = req.userId;
    const updateData = req.body;

    const dietarySupplements = await DietarySupplements.findById(dietaryId);

    if (!dietarySupplements) {
      return res.status(404).json({
        success: false,
        message: 'Dietary Supplements not found',
      });
    }

    if (dietarySupplements.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this Dietary Supplements',
      });
    }

    const updatedDietary = await DietarySupplements.findByIdAndUpdate(
      dietaryId,
      updateData,
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Dietary Supplements updated successfully',
      updatedDietary,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteDietarySupplements = async (req, res, next) => {
  try {
    const userId = req.userId;
    const dietaryId = req.params.dietaryId;
    const dietarySupplements = await DietarySupplements.findById(dietaryId);

    if (!dietarySupplements) {
      return res.status(404).json({
        success: false,
        message: 'Dietary Supplements not found',
      });
    }

    if (dietarySupplements.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this Dietary Supplements',
      });
    }

    await DietarySupplements.findByIdAndDelete(dietaryId);

    return res.status(200).json({
      success: true,
      message: 'Dietary Supplements deleted successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  addDietarySupplements,
  getAllDietarySupplements,
  getDietarySupplementsById,
  deleteDietarySupplements,
  getDietarySupplementsByUser,
  updateDietarySupplements,
};
