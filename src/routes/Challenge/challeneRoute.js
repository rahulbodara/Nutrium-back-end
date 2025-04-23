const express = require('express');
const router = express.Router();
const challengeController = require('../../controller/challenge/challengeController');

router.post('/create/:userId', challengeController.createChallenge);
router.post('/respond/:userId/:challengeId', challengeController.respondToChallenge);
router.post('/reinvite/:challengeId/:clientId', challengeController.reinviteClient);
router.get('/list/:userId', challengeController.getChallenges);
router.get('/participants/:challengeId', challengeController.viewParticipants);
router.get('/participanted/:userId', challengeController.getParticipatedChallenges)
router.get('/accepted-challenges/:userId', challengeController.getAcceptedChallenges)
router.get('/public', challengeController.getAllPublicChallenges);
router.get('/private/:userId', challengeController.getPrivateChallenges)
router.post('/public/join/:userId/:challengeId', challengeController.joinPublicChallenge)
router.put('/log-progress/:userId', challengeController.logProgress);
router.get('/:challengeId', challengeController.getChallengeById)
router.get('/creator/:creatorId', challengeController.getChallengesByCreator)
router.get('/all/private/:userId', challengeController.getAllPrivateChallenges)


module.exports = router;
