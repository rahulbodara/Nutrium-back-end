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
  deleteCommonMeasure,
  likeRecipe,
  getAllUserRecipe
} = require("../controller/recipeinformation");
const { checkPermission } = require("../middleware/checkPermission");

router.post("/recipe-information", isAuthenticated, checkPermission('create', "Create recipe API"), createRecipe);

router.put("/recipe-information/:recipeId", isAuthenticated, checkPermission('update', 'Update recipe API'), upload.single("image"), updateRecipe);

router.get("/get-recipeById/:recipeId", isAuthenticated, checkPermission('read', 'Get recipe API'), getRecipeById)

router.delete("/delete-recipe/:recipeId", isAuthenticated, checkPermission('delete', 'Delete recipe API'), deleteRecipe);

router.get("/getAll-recipe", isAuthenticated, checkPermission("read", "Get all recipe API"), getAllRecipe);

router.get("/getAll-User-recipe", isAuthenticated, checkPermission("read", "Get my recipe API"), getAllUserRecipe);


router.get("/copy-recipe/:recipeId", isAuthenticated, checkPermission("read", "Copy recipe API"), copyRecipe);

router.delete("/deleteparticularingridents/:recipeId/:objectId", isAuthenticated, checkPermission("delete", "Delete ingridents recipe API"), deleteMainFood)

router.delete("/deleteparticularsubfoods/:recipeId/:objectId", isAuthenticated, checkPermission("delete", "Delete sub food from recipe API"), deleteSubFoods);

router.delete("/deleteCommonMeasure/:recipeId/:objectId", isAuthenticated, checkPermission('delete', 'Delete commonmeasure recipe API'), deleteCommonMeasure);

router.post("/generateLike/:recipeId", isAuthenticated, checkPermission('read', "Like recipe API"), likeRecipe)


module.exports = router;
