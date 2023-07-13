const express = require("express");
const router = express.Router();
const billingInformationController = require("../controller/billinginformation");
const { isAuthenticated } = require("../middleware/auth");

router.get(
  "/billingInformation",
  isAuthenticated,
  billingInformationController.getBillingInformation
);
router.post(
  "/billingInformation",
  isAuthenticated,
  billingInformationController.createBillingInformation
);
router.put(
  "/billingInformation/:id",
  isAuthenticated,
  billingInformationController.updateBillingInformation
);
module.exports = router;
