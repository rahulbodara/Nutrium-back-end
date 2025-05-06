const express = require("express");
const serviceController = require("../controller/service");
const { isAuthenticated } = require("../middleware/auth");
const { checkPermission } = require("../middleware/checkPermission");
const router = express.Router();

router.post("/services", isAuthenticated, checkPermission("create", "Create service API"), serviceController.createService);
router.get("/services", isAuthenticated, checkPermission("read", "Get all services API"), serviceController.getAllServices);
router.get("/services/:id", isAuthenticated, checkPermission("read", "Get service API"), serviceController.getServiceById);
router.put("/services/:id", isAuthenticated, checkPermission("update", "Update service API"), serviceController.updateService);
router.delete(
  "/services/:id",
  isAuthenticated,
  checkPermission("delete", "Delete service API"),
  serviceController.deleteService
);

module.exports = router;
