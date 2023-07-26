const express = require("express");
const router = express.Router();
const SendMessegeData = require("../controller/sendmessege");
const { isAuthenticated } = require("../middleware/auth");
const upload = require('../middleware/imageHandler');


router.post("/messege", isAuthenticated,upload.single('attachedFiles'), SendMessegeData.createSendMessege);
router.get("/messege", isAuthenticated, SendMessegeData.getAllMessages);

module.exports = router;
