const express = require('express');
const router = express.Router();
const challengeController = require('../../controller/challenge/challengeController');
const { isAuthenticated } = require('../../middleware/auth');

router.post('/create/:userId', isAuthenticated, challengeController.createChallenge);
router.post('/respond/:userId/:challengeId', isAuthenticated, challengeController.respondToChallenge);
router.post('/reinvite/:challengeId/:clientId', isAuthenticated, challengeController.reinviteClient);
router.get('/list/:userId', isAuthenticated, challengeController.getChallenges);
router.get('/participants/:challengeId', isAuthenticated, challengeController.viewParticipants);
router.get('/participanted/:userId', isAuthenticated, challengeController.getParticipatedChallenges)
router.get('/accepted-challenges/:userId', isAuthenticated, challengeController.getAcceptedChallenges)
router.get('/public', isAuthenticated, challengeController.getAllPublicChallenges);
router.get('/private/:userId', isAuthenticated, challengeController.getPrivateChallenges)
router.post('/public/join/:userId/:challengeId', isAuthenticated, challengeController.joinPublicChallenge)
router.put('/log-progress/:userId', isAuthenticated, challengeController.logProgress);
router.get('/:challengeId', isAuthenticated, challengeController.getChallengeById)
router.get('/creator/:creatorId', isAuthenticated, challengeController.getChallengesByCreator)
router.get('/all/private/:userId', isAuthenticated, challengeController.getAllPrivateChallenges)
router.get('/all/public/:userId', isAuthenticated, challengeController.getAllPublicJoinedChallenges)

module.exports = router;
