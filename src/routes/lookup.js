const express = require("express")
const { getLookupByUser } = require("../controller/lookup")
const { isAuthenticated } = require("../middleware/auth")
const router = express()

router.get("/lookup", isAuthenticated, getLookupByUser)

module.exports = router