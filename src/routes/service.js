const express = require("express");
const serviceController = require("../controller/service");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.post("/services", isAuthenticated, serviceController.createService);
router.get("/services", isAuthenticated, serviceController.getAllServices);
router.get("/services/:id", isAuthenticated, serviceController.getServiceById);
router.put("/services/:id", isAuthenticated, serviceController.updateService);
router.delete(
  "/services/:id",
  isAuthenticated,
  serviceController.deleteService
);

module.exports = router;
