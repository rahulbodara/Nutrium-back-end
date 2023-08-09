const express = require('express');
const {
  addDietarySupplements,
  getAllDietarySupplements,
  getDietarySupplementsById,
  deleteDietarySupplements,
  getDietarySupplementsByUser,
  updateDietarySupplements,
} = require('../controller/dietarySupplements');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.post('/dietary-supplements', isAuthenticated, addDietarySupplements);
router.get('/dietary-supplements', isAuthenticated, getAllDietarySupplements);
router.get(
  '/dietary-supplements/:dietaryId',
  isAuthenticated,
  getDietarySupplementsById
);
router.delete(
  '/dietary-supplements/:dietaryId',
  isAuthenticated,
  deleteDietarySupplements
);

router.get(
  '/user-dietary-supplements',
  isAuthenticated,
  getDietarySupplementsByUser
);

router.put(
  '/dietary-supplements/:dietaryId',
  isAuthenticated,
  updateDietarySupplements
);

module.exports = router;
