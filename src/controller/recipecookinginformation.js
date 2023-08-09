const RecipeCookingData = require("../model/RecipsCookingMethod");

const createCookingInformation = async (req, res, next) => {
  try {
    const userId = req.userId;
    const newRecipe = new RecipeCookingData({ userId, ...req.body });
    const savedRecipe = await newRecipe.save();
    res.json(savedRecipe);
  } catch (error) {
    next(error);
  }
};

const updateCookingInformation = async (req, res, next) => {
  try {
    const updatedRecipe = await RecipeCookingData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};
const deleteCookingInformation = async (req, res, next) => {
  try {
    const deletedCookingInfo = await RecipeCookingData.findByIdAndDelete(
      req.params.id
    );
    res.json({ message: "Cooking information deleted", deletedCookingInfo });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCookingInformation,
  updateCookingInformation,
  deleteCookingInformation,
};
