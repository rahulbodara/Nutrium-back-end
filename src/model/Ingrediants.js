const mongoose = require("mongoose");

const IngrediantSchemna = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  ingrediant: {
    required: true,
    type: String,
  },
});
const Ingrediant = mongoose.model("Ingrediant", IngrediantSchemna);

module.exports = Ingrediant;
