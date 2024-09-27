import { RequestHandler } from "express";
import {
  ForfotVerifyEmailSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  UserSchema,
  verifyEmailSchema,
  VerifyEmailSchema,
} from "../zodTypeSchema/userSchema";
import { comparePassword, hashPassword } from "../lib/bcrypt";
import z from "zod";
import {
  checkExistsEmail,
  createUser,
  getUserByEmail,
  getVerificationCode,
  updateEmailPassword,
  updateVerificationCode,
} from "../lib/user";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../lib/email";
import {
  generateCryptoToken,
  generateTokenSetCookie,
  resetPasswordTokenExpires,
} from "../utils/token";
import { generateVerificationCode } from "../utils/generateVerificationCode";

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

    if (!userExist.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Please verify your email" });
    }

    const user = await comparePassword(password, userExist.password);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    await generateTokenSetCookie(res, userExist.id);

    const newUser = {
      userId: userExist.id,
      email: userExist.email,
      isVerified: userExist.isVerified,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: newUser,
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

    // Send verification email
    await sendVerificationEmail(user.email, verificationCode);

    // Generate and set token
    await generateTokenSetCookie(res, user.id);

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

export const verifyEmail: RequestHandler = async (req, res) => {
  const data: VerifyEmailSchema = req.body;
  const validatedData = verifyEmailSchema.safeParse(data);

  //validate data
  if (!validatedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code",
    });
  }

  const { code } = validatedData.data;
  try {
    const user = await getVerificationCode(code);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired verification code ",
      });
    }

    const updatedUser = await updateVerificationCode(user.id);

    // Send Welcome Email
    await sendWelcomeEmail(updatedUser.email);

    const newUser = {
      userId: updatedUser.id,
      email: updatedUser.email,
      verificationCode: updatedUser.verificationCode,
      verificationCodeExpires: updatedUser.verificationCodeExpires,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "Email successfully verified",
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
  res.clearCookie("auth_token");
  res.status(200).json({ success: true, message: "Logout successful" });
};

export const forgotPassword: RequestHandler = async (req, res) => {
  const data: ForfotVerifyEmailSchema = req.body;
  const validatedData = forgotPasswordSchema.safeParse(data);

  if (!validatedData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
    });
  }

  try {
    const { email } = validatedData.data;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = await generateCryptoToken();
    const resetTokenExpires = await resetPasswordTokenExpires();

    const updatedUser = await updateEmailPassword(
      user.id,
      resetToken,
      resetTokenExpires
    );

    // Send email
    await sendPasswordResetEmail(updatedUser.email, resetToken);

    const newUser = {
      userId: updatedUser.id,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
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
