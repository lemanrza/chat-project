import config from "../config/config.js";
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

const formatDateTime = (date: Date): string => {
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const sendVerificationEmail = async (
  toEmail: string,
  userFullName: string,
  verificationLink: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Bazaar" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #1e90ff; padding: 20px; color: white; text-align: center;">
              <h2 style="margin: 0;">Welcome to Bazaar!</h2>
            </div>
            <div style="padding: 30px; color: #333;">
              <p style="font-size: 16px;">Hi ${userFullName},</p>
              <p style="font-size: 16px;">
                Thanks for signing up to <strong>Bazaar</strong>. Please verify your email address by clicking the button below:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" target="_blank" 
                   style="background-color: #1e90ff; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
                  Verify Email
                </a>
              </div>
              <p style="font-size: 14px; color: #666;">
                If you did not create an account, you can safely ignore this email.
              </p>
            </div>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} Bazaar. All rights reserved.
            </div>
          </div>
        </div>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
