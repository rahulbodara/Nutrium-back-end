const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const upload = require("../middleware/imageHandler");

const {
  createRecipe,
  updateRecipe,
} = require("../controller/recipeinformation");

router.post(
  "/recipe-information",
  upload.single("image"),
  isAuthenticated,
  createRecipe
);
router.put(
  "/recipe-information/:id",
  upload.single("image"),
  isAuthenticated,
  updateRecipe
);

module.exports = router;
