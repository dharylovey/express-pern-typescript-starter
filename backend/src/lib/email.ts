import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const domain = process.env.CLIENT_URL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email",
    html: `
    <div style="text-align: center;">
      <h1 style="color: blue;">Please confirm your email</h1>
      <p style="font-size: 18px;">Copy the verification code below</p>
      <p style="font-size: 50px;">${token}</p>
      <p style="font-size: 18px;">This code will expire in 1 hour</p>
    </div>
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to our app",
    html: `
    <div style="text-align: center;">
      <h1 style="color: blue;">Welcome to our app</h1>
      <p style="font-size: 18px;">Thank you for joining our app</p>
    </div>
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `
    <div style="text-align: center;">
      <h1 style="color: blue;">Reset your password</h1>
      <p style="font-size: 18px;">Copy the verification code below</p>
      <p style="font-size: 18px;">${domain}/api/auth/forgot-password?token=${token}</p>
      <p style="font-size: 18px;">This code will expire in 1 hour</p>
    </div>
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
