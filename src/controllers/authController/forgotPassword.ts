import { sendPasswordResetEmail } from "@/lib/email";
import { getUserByEmail, updateEmailPassword } from "@/lib/user";
import catchErrors from "@/utils/catchErrors";
import { generateCryptoToken, resetPasswordTokenExpires } from "@/utils/token";
import {
  ForfotVerifyEmailSchema,
  forgotPasswordSchema,
} from "@/zodTypeSchema/userSchema";
import { Request, Response } from "express";

export const forgotPassword = catchErrors(
  async (req: Request, res: Response) => {
    const data: ForfotVerifyEmailSchema = req.body;
    const validatedData = forgotPasswordSchema.safeParse(data);

    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

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
  }
);
