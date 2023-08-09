const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

const {
  createCookingInformation,
  updateCookingInformation,
  deleteCookingInformation,
} = require("../controller/recipecookinginformation");

router.post(
  "/recipe-cooking-information",
  isAuthenticated,
  createCookingInformation
);
router.put(
  "/recipe-cooking-information/:id",
  isAuthenticated,
  updateCookingInformation
);
router.delete(
  "/recipe-cooking-information/:id",
  isAuthenticated,
  deleteCookingInformation
);

module.exports = router;
