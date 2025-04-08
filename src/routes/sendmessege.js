const express = require("express");
const router = express.Router();
const SendMessegeData = require("../controller/sendmessege");
const { isAuthenticated } = require("../middleware/auth");
const upload = require('../middleware/imageHandler');
const { getUserMessages } = require("../controller/mesages");


router.post("/messege", isAuthenticated, upload.single('attachedFiles'), SendMessegeData.createSendMessege);
router.get("/messege", isAuthenticated, SendMessegeData.getAllMessages);
router.get("/user-messages", isAuthenticated, getUserMessages)

module.exports = router;
