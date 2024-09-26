import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const domain = process.env.URL;

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
