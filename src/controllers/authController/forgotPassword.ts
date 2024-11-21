import z from "zod";
import { Request, Response } from "express";
import { sendPasswordResetEmail } from "@/lib/email";
import {
  ForfotVerifyEmailSchema,
  forgotPasswordSchema,
} from "@/zodTypeSchema/userSchema";
import { getUserByEmail, updateEmailPassword } from "@/lib/user";
import { generateCryptoToken, resetPasswordTokenExpires } from "@/utils/token";

export const forgotPassword = async (req: Request, res: Response) => {
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
