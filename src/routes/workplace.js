const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const workplaceController = require("../controller/workplace");

const router = express.Router();

router.post(
  "/workplaces",
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
  "/workplaces/:id",
  isAuthenticated,
  workplaceController.updateWorkplace
);
router.delete(
  "/workplaces/:id",
  isAuthenticated,
  workplaceController.deleteWorkplace
);

module.exports = router;
