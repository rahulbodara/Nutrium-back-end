const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const {
  fetchFoodDiary,
  addMealInDiary,
  updateTimeAndCommentInDiary,
  deleteFoodFromDiary,
  deleteMealScheduleInFoodDiary,
} = require("../controller/client/foodDiary");
const upload = require("../middleware/imageHandler");
const { checkPermission } = require("../middleware/checkPermission");

const router = express.Router();

router.get('/food-diary/:clientId', isAuthenticated, checkPermission("read", "Get client food diary API"), fetchFoodDiary);
router.post('/food-diary-add-meal/:clientId', isAuthenticated, checkPermission("create", "Add meal to client food diary API"), upload.single('photo'), addMealInDiary);
router.put("/food-diary/:clientId", isAuthenticated, updateTimeAndCommentInDiary);
router.delete('/food-diary/:clientId/delete-food', isAuthenticated, checkPermission("delete", "Delete food client food diary API"), deleteFoodFromDiary);
router.delete('/food-diary/:clientId/delete-meal-schedule', isAuthenticated, checkPermission("delete", "Delete meal schedule client food diary API"), deleteMealScheduleInFoodDiary);

module.exports = router;
