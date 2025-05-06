const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const workplaceController = require("../controller/workplace");
const upload = require("../middleware/imageHandler");
const { checkPermission } = require("../middleware/checkPermission");

const router = express.Router();

router.post(
  "/workplaces",
  upload.single('image'),
  isAuthenticated,
  checkPermission('create', 'Create workplace API'),
  workplaceController.createWorkplace
);

router.get(
  "/workplaces",
  isAuthenticated,
  checkPermission('read', "Get all workplace data API"),
  workplaceController.getAllWorkplaces
);
router.get(
  "/workplaces/:id",
  isAuthenticated,
  checkPermission("read", "Get workplace API"),
  workplaceController.getWorkplaceById
);
router.put(
  "/workplaces/:id", upload.single('image'),
  isAuthenticated,
  checkPermission("update", "Update workplace API"),
  workplaceController.updateWorkplace
);
router.delete(
  "/workplaces/:id",
  isAuthenticated,
  checkPermission("delete", "Delete workplace API"),
  workplaceController.deleteWorkplace
);

module.exports = router;
