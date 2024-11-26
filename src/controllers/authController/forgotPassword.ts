import { ErrorCode, SuccessCode } from "@/constant/responseMessage";
import { BAD_REQUEST, OK } from "@/constant/httpStatusCode";
import { sendPasswordResetEmail } from "@/lib/email";
import { getUserByEmail, updateEmailPassword } from "@/lib/user";
import catchErrors from "@/utils/catchErrors";
import { generateCryptoToken, resetPasswordTokenExpires } from "@/utils/token";
import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from "@/zodTypeSchema/userSchema";
import { Request, Response } from "express";

export const forgotPassword = catchErrors(
  async (req: Request, res: Response) => {
    const data: ForgotPasswordSchema = req.body;
    const validatedData = forgotPasswordSchema.safeParse(data);

    if (!validatedData.success)
      return res.status(BAD_REQUEST).json({
        success: false,
        message: ErrorCode.InvalidPassword,
      });

    const { email } = validatedData.data;
    const user = await getUserByEmail(email);

    if (!user)
      return res.status(BAD_REQUEST).json({
        success: false,
        message: ErrorCode.UserNotFound,
      });

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

    return res.status(OK).json({
      success: true,
      message: SuccessCode.PasswordReset,
      data: newUser,
    });
  }
);
