const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const upload = require("../middleware/imageHandler");

const {
  createRecipe,
  updateRecipe,
  getRecipeById,
  deleteRecipe,
  getAllRecipe,
  copyRecipe,
  deleteMainFood,
  deleteSubFoods,
  deleteCommonMeasure
} = require("../controller/recipeinformation");

router.post("/recipe-information", isAuthenticated, createRecipe);

router.put("/recipe-information/:recipeId", upload.single("image"), isAuthenticated, updateRecipe);

router.get("/get-recipeById/:recipeId", isAuthenticated, getRecipeById)

router.delete("/delete-recipe/:recipeId", isAuthenticated, deleteRecipe);

router.get("/getAll-recipe",isAuthenticated,getAllRecipe);

router.get("/copy-recipe/:recipeId",isAuthenticated,copyRecipe);

router.delete("/deleteparticularingridents/:recipeId/:objectId",isAuthenticated,deleteMainFood)

router.delete("/deleteparticularsubfoods/:recipeId/:objectId",isAuthenticated,deleteSubFoods);

router.delete("/deleteCommonMeasure/:recipeId/:objectId",isAuthenticated,deleteCommonMeasure);

module.exports = router;
