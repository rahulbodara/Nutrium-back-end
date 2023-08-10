const express = require("express");
const router = express.Router();
const {
  createIngredient,
  getAllIngredients,
} = require("../controller/ingrediant");
const { isAuthenticated } = require("../middleware/auth");

router.post("/ingrediants", isAuthenticated, createIngredient);
router.get("/ingrediants", isAuthenticated, getAllIngredients);
module.exports = router;
