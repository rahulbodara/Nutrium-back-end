const express = require("express");
const secretariesController = require("../controller/secretaries");
const { isAuthenticated } = require("../middleware/auth");
const upload = require("../middleware/imageHandler");
const router = express.Router();

router.post("/secretaries", isAuthenticated,upload.single("image"), secretariesController.createSecretaries);
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
  isAuthenticated,upload.single("image"),
  secretariesController.updateSecretaries
);
router.delete(
  "/secretaries/:id",
  isAuthenticated,
  secretariesController.deleteSecretaries
);

module.exports = router;
