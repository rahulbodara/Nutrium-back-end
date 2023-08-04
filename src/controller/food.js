const { default: axios } = require("axios");
const Foods = require("../model/Food");

const addFoods = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { name, source, group,quantity, macronutrients, micronutrients } = req.body;
    const groupOptionsResponse = await axios.get(
      "http://localhost:8080/api/v1/group-options"
    );
    const groupOptions = groupOptionsResponse.data;

    if (!groupOptions.includes(group)) {
      return res.status(400).json({ error: "Invalid group option" });
    }

    const newFood = {
      userId,
      name,
      source,
      group: req.body.group,
      quantity,
      macronutrients,
      micronutrients,
    };

    const savedFood = await Foods.create(newFood);
    res.status(201).json(savedFood);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addFoods,
};
