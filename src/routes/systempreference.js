const express = require("express");
const router = express.Router();
const {
  createSystemPreference,
  getSystemPreference,
  updateSystemPreference,
} = require("../controller/systempreference");
const { isAuthenticated } = require("../middleware/auth");

router.post("/systempreference", isAuthenticated, createSystemPreference);

router.get("/systempreference", isAuthenticated, getSystemPreference);

router.put("/systempreference/:id", isAuthenticated, updateSystemPreference);

module.exports = router;
