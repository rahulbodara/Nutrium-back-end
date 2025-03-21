const express = require("express");
const router = express.Router();
const {
  getBillingInformation,
  createBillingInformation,
  updateBillingInformation,
  createBillingInformationAPI,
} = require("../controller/billinginformation");
const { isAuthenticated } = require("../middleware/auth");

router.get("/billingInformation", isAuthenticated, getBillingInformation);
router.post("/billingInformation", isAuthenticated, createBillingInformation);
router.post("/billingInformation-api", isAuthenticated, createBillingInformationAPI);
router.put(
  "/billingInformation",
  isAuthenticated,
  updateBillingInformation
);
module.exports = router;
