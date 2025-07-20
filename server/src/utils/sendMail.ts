import config from "../config/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASS,
  },
});

const generateUnlockAccountHTML = (
  name: string,
  unlockAccountLink: string,
  lockUntil: string
): string => {
  return `
      <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      .email-header {
        background-color: #007bff;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .email-header h1 {
        margin: 0;
        font-size: 24px;
      }
      .email-body {
        padding: 20px;
        color: #333333;
        line-height: 1.6;
      }
      .email-body p {
        margin: 0 0 15px;
      }
      .email-footer {
        text-align: center;
        padding: 20px;
        background-color: #f4f4f4;
        font-size: 12px;
        color: #777777;
      }
      .unlock-button {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .unlock-button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>Unlock Your Account</h1>
      </div>
      <div class="email-body">
        <p>Hi ${name},</p>
        <p>We noticed that your account has been locked due to multiple unsuccessful login attempts. Your account will remain locked until <strong>${lockUntil}</strong>. To regain access sooner, please click the button below to unlock your account:</p>
        <a href="${unlockAccountLink}" class="unlock-button">Unlock Account</a>
        <p>If you did not attempt to log in, please contact our support team immediately.</p>
        <p>Thank you, The ChatWave Team</p>
      </div>
      <div class="email-footer">
        <p>&copy; 2025 ChatWave. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
      `;
};

export const sendUnlockAccountEmail = async (
  recipientEmail: string,
  name: string,
  unlockTime: any,
  unlockAccountLink: any
) => {
  try {
    const htmlContent = generateUnlockAccountHTML(
      name,
      unlockAccountLink,
      unlockTime
    );

    const mailOptions = {
      from: `"ChatWave Security" <${config.GMAIL_USER}>`,
      to: recipientEmail,
      subject: "Account Locked - Action Required",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending unlock account email:", error);
  }
};
