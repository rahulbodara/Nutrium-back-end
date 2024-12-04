const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const workplaceController = require("../controller/workplace");
const upload = require("../middleware/imageHandler");

const router = express.Router();

router.post(
  "/workplaces", upload.single('image'),
  isAuthenticated,
  workplaceController.createWorkplace
);
router.get(
  "/workplaces",
  isAuthenticated,
  workplaceController.getAllWorkplaces
);
router.get(
  "/workplaces/:id",
  isAuthenticated,
  workplaceController.getWorkplaceById
);
router.put(
  "/workplaces/:id", upload.single('image'),
  isAuthenticated,
  workplaceController.updateWorkplace
);
router.delete(
  "/workplaces/:id",
  isAuthenticated,
  workplaceController.deleteWorkplace
);

module.exports = router;
