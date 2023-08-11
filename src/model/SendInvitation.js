const mongoose = require('mongoose');

const sendInvitationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Pending_Invitation',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InviteUser', sendInvitationSchema);
