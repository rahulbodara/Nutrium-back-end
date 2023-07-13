const express = require("express");
const router = express.Router();
const subscriptionController = require("../controller/subscription");
const { isAuthenticated } = require("../middleware/auth");

router.get(
  "/subscription",
  isAuthenticated,
  subscriptionController.getSubscription
);
router.post(
  "/subscription",
  isAuthenticated,
  subscriptionController.createSubscription
);
router.put(
  "/subscription/:id",
  isAuthenticated,
  subscriptionController.updateSubscription
);

module.exports = router;
