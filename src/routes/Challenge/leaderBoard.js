const express = require('express')
const { getLeaderboard } = require('../../controller/challenge/leaderBoard')
const router = express.Router()



router.get('/:challengeId', getLeaderboard)
module.exports = router
