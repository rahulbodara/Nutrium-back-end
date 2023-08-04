const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const foodsRoutes = require("../controller/food");

router.post("/foods", isAuthenticated, foodsRoutes.addFoods);

module.exports = router;
