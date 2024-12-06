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

const generateVerificationToken = async (user) => {
  
  const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h', 
  });

  const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); 

  user.verificationEmailToken = token;
  user.verificationEmailTokenExpires = verificationTokenExpires;

  await user.save();

  return { token, name: user.fullName };
};

const sendVerificationEmail = async (email, token, fullName) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const verificationUrl = `https://nutrium-back-end-1.onrender.com/api/v1/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Confirmation instructions',
    html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7; }
            .email-container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 20px; }
            .header { background-color: #1ab394; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header img { width: 150px;height:40px; }
            .content { padding: 20px; text-align: center; color: #676a6c;}
            .content h2{
              font-size: 40px;
            }
            .button { background-color: #1ab394; color: #ffffff; padding: 15px 25px; font-size: 16px; border-radius: 3px; text-decoration: none; display: inline-block; margin-top: 20px; }
            .footer { text-align: center; padding: 10px; font-size: 12px; color: #676a6c;background-color:#f3f3f4; }
            .footer > span {
              font-size: 12px;
              font-weight: bold;
            }
            .footer > span >a {
              color: #1155cc;
              font-weight: 600;
            }
            
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <img src="/" alt="Logo">
            </div>
            <div class="content">
              <h2>Confirm your email</h2>
              <p>This email address has been associated to your Nutrium account.</p>
              <p>Please confirm your email address so we know it's really you by clicking in the button below.</p>
              <a href="${verificationUrl}" class="button">Confirm</a>
            </div>
            <div class="footer">
              <p>Copyright © 2024 YourCompanyName</p>
              <span>Our mailing address is: <br/> 
              <a href="/">
                
              support@yourcompany.com
              </a>
              </span>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendEmail = async (email, resetToken, name) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const resetUrl = `https://nutrium-front-end-six.vercel.app/accounts/changePassword?token=${resetToken}`;
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

  const acceptLink = `https://nutrium-back-end-1.onrender.com/api/v1/invitations?inviteId=${inviteId}`;

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
  generateVerificationToken,
  sendVerificationEmail
};
