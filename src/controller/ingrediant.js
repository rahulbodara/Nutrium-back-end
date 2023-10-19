const Food = require("../model/Food");
const Ingredient = require("../model/Ingrediants");
const axios = require("axios");

const createIngredient = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { foodId } = req.body;
    const idAvailble = Food.find(_id === foodId);
    const newIngredient = await Ingredient.create({
      userId,
      ingredient: [foodId],
    });
    res.status(201).json({
      success: true,
      message: "Ingredient created successfully",
      newIngredient,
    });
  } catch (error) {
    next(error);
  }
};

const getAllIngredients = async (req, res) => {
  try {
    const allIngredients = await Ingredient.find().populate(
      "selectedFood",
      "name source group"
    );
    res.status(200).json(allIngredients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIngredient,
  getAllIngredients,
};
