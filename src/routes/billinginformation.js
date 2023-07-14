const express = require("express");
const router = express.Router();
const {
  getBillingInformation,
  createBillingInformation,
  updateBillingInformation,
} = require("../controller/billinginformation");
const { isAuthenticated } = require("../middleware/auth");

router.get("/billingInformation", isAuthenticated, getBillingInformation);
router.post("/billingInformation", isAuthenticated, createBillingInformation);
router.put(
  "/billingInformation/:id",
  isAuthenticated,
  updateBillingInformation
);
module.exports = router;
