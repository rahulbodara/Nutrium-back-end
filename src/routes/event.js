const express = require("express");
const router = express.Router();
const eventController=require("../controller/event")
const { isAuthenticated } = require("../middleware/auth");

router.post("/event", isAuthenticated, eventController.createEvent);
router.get("/event", isAuthenticated, eventController.getAllEvents);
router.put('/event/:id', isAuthenticated,eventController.updateEvent);
router.delete('/event/:id', isAuthenticated,eventController.deleteEvent);

module.exports = router;
