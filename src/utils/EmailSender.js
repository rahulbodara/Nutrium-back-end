const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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
  const resetUrl = `http://localhost:3000/api/v1/forget-password?token=${resetToken}`;
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

module.exports = {
  generateResetToken,
  sendEmail,
};
