const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const generateResetToken = async (user) => {
  const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

  user.resetToken = token;
  user.resetTokenExpires = resetTokenExpires;

  await user.save();

  return token;
};

const sendEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  // const resetUrl = `http://localhost:8080/api/v1/forget-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Password Reset',
    html: `<p>Please click the following link to reset your password:</p>
    <a href="http://localhost:8080/api/v1/forget-password?token=${resetToken}">Reset Password</a>`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateResetToken,
  sendEmail,
};