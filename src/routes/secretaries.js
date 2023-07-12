const express = require("express");
const secretariesController = require("../controller/secretaries");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.post("/secretaries", isAuthenticated, secretariesController.createSecretaries);
router.get(
  "/secretaries",
  isAuthenticated,
  secretariesController.getAllSecretaries
);
router.get(
  "/secretaries/:id",
  isAuthenticated,
  secretariesController.getSecretariesById
);
router.put(
  "/secretaries/:id",
  isAuthenticated,
  secretariesController.updateSecretaries
);
router.delete(
  "/secretaries/:id",
  isAuthenticated,
  secretariesController.deleteSecretaries
);

module.exports = router;
