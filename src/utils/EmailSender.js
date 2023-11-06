const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const path = require('path');

const generateResetToken = async (user) => {
  const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });
  const resetTokenExpires = new Date(Date.now() + 5 * 60 * 1000);

  user.resetToken = token;
  user.resetTokenExpires = resetTokenExpires;

  await user.save();

  return { token, name: user.fullName };
};

const sendEmail = async (email, resetToken, name) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const resetUrl = `http://localhost:3000/api/v1/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Password Reset',
    html: `<p>Hello ${name}</p>
    <p>Someone has requested a link to change your password, and you can do this through the link below.</p>
    <a href="${resetUrl}">Change my password</a>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Your password won't change until you access the link above and create a new one.</p>`,
  };
  await transporter.sendMail(mailOptions);
};

const sendInvitationEmail = async (
  inviteEmail,
  inviteId,
  username,
  useremail
) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const acceptLink = `http://localhost:3000/api/v1/invitations?inviteId=${inviteId}`;

  // Render the invitation template with dynamic content
  const filePath = path.join(__dirname, '../view', 'invitation.ejs');
    const htmlContent = await ejs.renderFile(
      filePath,
      {
        title: `${username} invited you to Nutrium`,
        acceptLink: acceptLink,
        useremail: useremail,
        username: username,
      }
    );

    const mailOptions = {
      from: process.env.GMAIL,
      to: inviteEmail,
      subject: `${username} invited you to Nutrium`,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = {
  generateResetToken,
  sendEmail,
  sendInvitationEmail,
};
