const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const {
  addFood,
  getAllFood,
  getFoodById,
  getFoodsByUser,
  deleteFood,
  updateFood,
  deleteCommonMeasure
} = require('../controller/food');
const router = express.Router();

router.post('/foods', isAuthenticated, addFood);
router.get('/foods', isAuthenticated, getAllFood);
router.get('/foods/:foodId', isAuthenticated, getFoodById);
router.get('/user-foods', isAuthenticated, getFoodsByUser);
router.delete('/foods/:foodId', isAuthenticated, deleteFood);
router.put('/foods/:foodId', isAuthenticated, updateFood);
router.delete('/deleteCommonMeasure/:foodId', isAuthenticated, deleteCommonMeasure);

module.exports = router;
