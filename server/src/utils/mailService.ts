import nodemailer, { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface EmailOptions {
    toEmail: string;
    userFullName: string;
    verificationLink?: string;
    unlockAccountLink?: string;
    resetPasswordLink?: string;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER as string,
        pass: process.env.GMAIL_PASS as string,
    },
});

// Helper function to format date and time
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

const sendVerificationEmail = async (
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

const sendUnlockAccountEmail = async (
    toEmail: string,
    userFullName: string,
    unlockAccountLink: string
): Promise<void> => {
    try {
        const lockDate = new Date();
        const unlockDate = new Date(lockDate.getTime() + 10 * 60 * 1000); // 10 minutes later

        await transporter.sendMail({
            from: `"Bazaar" <${process.env.GMAIL_USER}>`,
            to: toEmail,
            subject: "Account Locked - Unlock Your Bazaar Account",
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #ff4d4f; padding: 20px; color: white; text-align: center;">
              <h2 style="margin: 0;">Account Locked</h2>
            </div>
            <div style="padding: 30px; color: #333;">
              <p style="font-size: 16px;">Hi ${userFullName},</p>
              <p style="font-size: 16px;">
                Your <strong>Bazaar</strong> account was temporarily locked due to 3 incorrect login attempts in a row.
              </p>
              <p style="font-size: 16px;">
                <strong>Lock Time:</strong> ${formatDateTime(lockDate)}<br/>
                <strong>Unlock Time:</strong> ${formatDateTime(unlockDate)}
              </p>
              <p style="font-size: 16px;">
                The account will automatically unlock after 10 minutes. You can also unlock it manually by clicking the button below:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${unlockAccountLink}" target="_blank" 
                  style="background-color: #1e90ff; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
                  Unlock My Account
                </a>
              </div>
              <p style="font-size: 14px; color: #666;">
                If the unlock time has already passed, you can safely ignore this email.
                <br/>
                If you didn’t attempt to log in, we recommend changing your password and contacting support.
              </p>
            </div>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} Bazaar. All rights reserved.
            </div>
          </div>
        </div>`,
        });
    } catch (error) {
        console.error("Error sending unlock email:", error);
    }
};

const sendForgotPasswordEmail = async (
    toEmail: string,
    resetPasswordLink: string
): Promise<void> => {
    try {
        await transporter.sendMail({
            from: `"Bazaar" <${process.env.GMAIL_USER}>`,
            to: toEmail,
            subject: "Reset Your Bazaar Account Password",
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="background-color: #1e90ff; padding: 20px; color: white; text-align: center;">
              <h2 style="margin: 0;">Reset Your Password</h2>
            </div>
            <div style="padding: 30px; color: #333;">
              <p style="font-size: 16px;">Hi there,</p>
              <p style="font-size: 16px;">
                We received a request to reset the password for your <strong>Bazaar</strong> account.
              </p>
              <p style="font-size: 16px;">
                Click the button below to reset your password. This link is valid for the next 30 minutes:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetPasswordLink}" target="_blank" 
                  style="background-color: #ff4d4f; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 14px; color: #666;">
                If you didn’t request a password reset, you can safely ignore this email.
                <br/>
                For further assistance, please contact our support team.
              </p>
            </div>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              &copy; ${new Date().getFullYear()} Bazaar. All rights reserved.
            </div>
          </div>
        </div>`,
        });
    } catch (error) {
        console.error("Error sending forgot password email:", error);
    }
};

export { sendVerificationEmail, sendUnlockAccountEmail, sendForgotPasswordEmail };
