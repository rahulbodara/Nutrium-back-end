const express = require('express');
const router = express.Router();
const challengeController = require('../../controller/challenge/challengeController');

router.post('/create/:userId', challengeController.createChallenge);
router.post('/:userId/respond/:challengeId', challengeController.respondToChallenge);
router.post('/:userId/reinvite/:challengeId/:clientId', challengeController.reinviteClient);
router.get('/:userId/list', challengeController.getChallenges);
router.get('/:userId/:challengeId/participants', challengeController.viewParticipants);

module.exports = router;
