import { Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Generate token
export const generateTokenSetCookie = async (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
};

export const generateCryptoToken = async () => {
  const resetToken = crypto.randomUUID().toString();

  return resetToken;
};

export const resetPasswordTokenExpires = async () => {
  const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 day
  return resetTokenExpires;
};
