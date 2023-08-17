const SendInvitation = require('../model/SendInvitation');
const User = require('../model/User');
const { sendInvitationEmail } = require('../utils/EmailSender');

const sendInvitation = async (req, res, next) => {
  try {
    const { inviteEmail } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId);
    const newInvitation = await SendInvitation.create({
      email: inviteEmail,
      userId: userId,
    });

    invitationId = newInvitation._id.toString();
    username = user.fullName;
    useremail = user.email;
    await sendInvitationEmail(inviteEmail, invitationId, username, useremail);

    return res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    console.log('error', error);
    next(error);
  }
};

const acceptInvitation = async (req, res, next) => {
  try {
    const { inviteId } = req.query;
    console.log('inviteId', inviteId);

    await SendInvitation.findByIdAndUpdate(
      inviteId,
      { status: 'Accepted' },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Invitation accepted successfully',
    });
  } catch (error) {
    console.log('error---------->', error);
    next(error);
  }
};

const getPendingInvitation = async (req, res, next) => {
  try {
    const userId = req.userId;

    const pendingInvitations = await SendInvitation.find({
      userId: userId,
      status: 'Pending_Invitation',
    });

    return res.status(200).json({
      success: true,
      message: 'Pending invitations retrieved successfully',
      invitations: pendingInvitations,
    });
  } catch (error) {
    console.log('error---------->', error);
    next(error);
  }
};

const deleteInvitation = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { inviteId } = req.body;

    const deleteInvitations = await SendInvitation.findByIdAndDelete({
      _id: inviteId,
      userId: userId,
    });

    return res.status(200).json({
      success: true,
      message: 'Pending invitations deleted successfully',
      deleteInvitations,
    });
  } catch (error) {
    console.log('error---------->', error);
    next(error);
  }
};

module.exports = {
  sendInvitation,
  acceptInvitation,
  getPendingInvitation,
  deleteInvitation,
};
