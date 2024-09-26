import { RequestHandler } from "express";
import {
  loginSchema,
  registerSchema,
  UserSchema,
} from "../zodTypeSchema/userSchema";
import { comparePassword, hashPassword } from "../lib/bcrypt";
import z from "zod";
import { checkExistsEmail, createUser, getUserByEmail } from "../lib/user";
import { generateTokenSetCookie } from "../utils/token";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { sendVerificationEmail } from "../lib/email";

export const login: RequestHandler = async (req, res) => {
  const data: UserSchema = req.body;
  const validatedData = loginSchema.safeParse(data);

  try {
    if (!validatedData.success)
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });

    const { email, password } = validatedData.data;

    const userExist = await getUserByEmail(email);
    if (!userExist || !userExist.password || !userExist.email) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = await comparePassword(password, userExist.password);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // const token = generateTokenSetCookie(email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      // token,
    });
  } catch (error) {}
};

export const register: RequestHandler = async (req, res) => {
  const data: UserSchema = req.body;
  const validatedData = registerSchema.safeParse(data);

  // Validate data
  if (!validatedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const { email, password, confirmPassword } = validatedData.data;

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        Success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const userExist = await checkExistsEmail(email);

    if (userExist) {
      return res
        .status(400)
        .json({ Success: false, message: "User already exists" });
    }

    // Hash password
    const hashPW = await hashPassword(password);

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Save user to database
    const user = await createUser(email, hashPW, verificationCode);

    const newUser = {
      userId: user.id,
      email: user.email,
      verificationCode,
      verificationCodeExpires: user.verificationCodeExpires,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Generate and set token
    await generateTokenSetCookie(res, user.id);

    // Send verification email
    await sendVerificationEmail(user.email, verificationCode);

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error);
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data" });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout: RequestHandler = (req, res) => {
  res.send("Logged out");
};
