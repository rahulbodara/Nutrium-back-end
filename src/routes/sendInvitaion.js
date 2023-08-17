const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const {
  sendInvitation,
  acceptInvitation,
  getPendingInvitation,
  deleteInvitation,
} = require('../controller/inviteUser');
const router = express.Router();

router.post('/invitations', isAuthenticated, sendInvitation);
router.get('/invitations', acceptInvitation);
router.get('/pending-invitations', isAuthenticated, getPendingInvitation);
router.delete('/pending-invitations', isAuthenticated, deleteInvitation);

module.exports = router;
