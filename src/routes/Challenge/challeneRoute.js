const express = require('express');
const router = express.Router();
const challengeController = require('../../controller/challenge/challengeController');
const { isAuthenticated, protect } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/checkPermission');

// Basic CRUD routes
router.post('/create', isAuthenticated, challengeController.createChallenge);
router.get('/all-challenge', isAuthenticated, challengeController.getAllChallenges);
router.get('/list/:userId', isAuthenticated, challengeController.getChallenges);
router.get('/:challengeId', isAuthenticated, challengeController.getChallengeById);
router.put('/:id', isAuthenticated, challengeController.updateChallenge);
router.delete('/:id', isAuthenticated, challengeController.deleteChallenge);

// Challenge participation routes
router.post('/respond/:userId/:challengeId', isAuthenticated, challengeController.respondToChallenge);
router.post('/reinvite/:challengeId/:clientId', isAuthenticated, challengeController.reinviteClient);
router.get('/participants/:challengeId', isAuthenticated, challengeController.viewParticipants);
router.get('/participanted/:userId', isAuthenticated, challengeController.getParticipatedChallenges);
router.get('/accepted-challenges/:userId', isAuthenticated, challengeController.getAcceptedChallenges);

// Public/Private challenge routes
router.get('/public', isAuthenticated, challengeController.getAllPublicChallenges);
router.get('/private/:userId', isAuthenticated, challengeController.getPrivateChallenges);
router.post('/public/join/:userId/:challengeId', isAuthenticated, challengeController.joinPublicChallenge);
router.get('/all/private/:userId', isAuthenticated, challengeController.getAllPrivateChallenges);
router.get('/all/public/:userId', isAuthenticated, challengeController.getAllPublicJoinedChallenges);

// Progress tracking
router.put('/log-progress/:userId', isAuthenticated, challengeController.logProgress);

// Creator routes
router.get('/creator/:creatorId', isAuthenticated, challengeController.getChallengesByCreator);

// Enhanced features routes
router.get('/:id/analytics', isAuthenticated, challengeController.getChallengeAnalytics);
router.get('/category/:category', isAuthenticated, challengeController.getChallengesByCategory);
router.post('/:id/feedback', isAuthenticated, challengeController.submitFeedback);

// Template routes
router.get('/templates', isAuthenticated, challengeController.getTemplates);
router.post('/templates/:templateId/create', isAuthenticated, challengeController.createFromTemplate);

module.exports = router;
