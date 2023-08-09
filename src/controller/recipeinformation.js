const RecipeData = require("../model/RecipsInformation");

const createRecipe = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (req.file) {
      req.body.image = req.file.filename;
    }
    const newRecipe = new RecipeData({ userId, ...req.body });
    const savedRecipe = await newRecipe.save();
    res.json(savedRecipe);
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.filename;
    }
    const updatedRecipe = await RecipeData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

module.exports = { createRecipe, updateRecipe };
