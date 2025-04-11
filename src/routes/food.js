const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const {
  addFood,
  getAllFood,
  searchFood,
  getFoodById,
  getFoodsByUser,
  deleteFood,
  updateFood,
  deleteCommonMeasure,
  getClientFoodById
} = require('../controller/food');
const router = express.Router();

router.post('/foods', isAuthenticated, addFood);
router.get('/foods', getAllFood);
router.get('/search-foods', isAuthenticated, searchFood);
router.get('/foods/:foodId', isAuthenticated, getFoodById);
router.get('/client-foods/:foodId', isAuthenticated, getClientFoodById);
router.get('/user-foods', isAuthenticated, getFoodsByUser);
router.delete('/foods/:foodId', isAuthenticated, deleteFood);
router.put('/foods/:foodId', isAuthenticated, updateFood);
router.delete('/deleteCommonMeasure/:foodId', isAuthenticated, deleteCommonMeasure);

module.exports = router;
