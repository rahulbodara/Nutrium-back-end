const express = require("express");
const secretariesController = require("../controller/secretaries");
const { isAuthenticated } = require("../middleware/auth");
const upload = require("../middleware/imageHandler");
const { checkPermission } = require("../middleware/checkPermission");
const router = express.Router();

router.post("/secretaries", isAuthenticated, checkPermission("create", "Create secretary API"), upload.single("image"), secretariesController.createSecretaries);
router.get(
  "/secretaries",
  isAuthenticated,
  checkPermission("read", "Get all secretaries API"),
  secretariesController.getAllSecretaries
);
router.get(
  "/secretaries/:id",
  isAuthenticated,
  checkPermission("read", "Get secretary API"),
  secretariesController.getSecretariesById
);
router.put(
  "/secretaries/:id",
  isAuthenticated,
  checkPermission("update", "Update secretary API"),
  upload.single("image"),
  secretariesController.updateSecretaries
);
router.delete(
  "/secretaries/:id",
  isAuthenticated, checkPermission("delete", "Delete secretary API"),
  secretariesController.deleteSecretaries
);

module.exports = router;
